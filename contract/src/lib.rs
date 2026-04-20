#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    token, Address, Env, Symbol,
};

// Storage keys
const MISSION: Symbol = symbol_short!("MISSION");

/// Represents a savings mission locked by a student
#[contracttype]
#[derive(Clone)]
pub struct Mission {
    pub owner: Address,       // student wallet
    pub amount: i128,         // locked XLM amount in stroops
    pub unlock_ledger: u32,   // ledger sequence when mission completes
    pub reward: i128,         // bonus reward in stroops
    pub completed: bool,
}

#[contract]
pub struct BalanceQuestContract;

#[contractimpl]
impl BalanceQuestContract {
    /// Lock XLM for a savings mission.
    /// student: the wallet locking funds
    /// amount: stroops to lock
    /// duration_ledgers: how many ledgers until unlock (approx 5 days ≈ 72000 ledgers)
    /// reward: bonus stroops released on completion
    /// token_id: the XLM/USDC token contract address
    pub fn create_mission(
        env: Env,
        student: Address,
        amount: i128,
        duration_ledgers: u32,
        reward: i128,
        token_id: Address,
    ) {
        // Require the student to authorize this call
        student.require_auth();

        // Prevent duplicate active mission for same student
        if env.storage().instance().has(&MISSION) {
            panic!("active mission already exists");
        }

        // Transfer the locked amount from student into the contract
        let token_client = token::Client::new(&env, &token_id);
        token_client.transfer(&student, &env.current_contract_address(), &amount);

        let unlock_ledger = env.ledger().sequence() + duration_ledgers;

        let mission = Mission {
            owner: student.clone(),
            amount,
            unlock_ledger,
            reward,
            completed: false,
        };

        // Persist mission to contract storage
        env.storage().instance().set(&MISSION, &mission);

        // Emit event for mission creation
        env.events().publish(
            (symbol_short!("created"), student),
            (amount, unlock_ledger),
        );
    }

    /// Complete a mission and release locked funds + reward to the student.
    /// token_id: XLM/USDC token contract; reward_source: contract treasury wallet
    pub fn complete_mission(
        env: Env,
        token_id: Address,
        reward_source: Address,
    ) {
        let mut mission: Mission = env
            .storage()
            .instance()
            .get(&MISSION)
            .expect("no active mission");

        // Require the mission owner to trigger completion
        mission.owner.require_auth();

        // Enforce time lock: mission must have matured
        if env.ledger().sequence() < mission.unlock_ledger {
            panic!("mission not yet complete");
        }

        if mission.completed {
            panic!("mission already claimed");
        }

        let token_client = token::Client::new(&env, &token_id);

        // Release locked principal back to student
        token_client.transfer(
            &env.current_contract_address(),
            &mission.owner,
            &mission.amount,
        );

        // Transfer bonus reward from reward_source treasury to student
        reward_source.require_auth();
        token_client.transfer(&reward_source, &mission.owner, &mission.reward);

        mission.completed = true;
        env.storage().instance().set(&MISSION, &mission);

        // Emit completion event
        env.events().publish(
            (symbol_short!("complete"), mission.owner.clone()),
            mission.amount + mission.reward,
        );
    }

    /// Early withdrawal — student forfeits reward and only gets principal back.
    pub fn withdraw_early(env: Env, token_id: Address) {
        let mission: Mission = env
            .storage()
            .instance()
            .get(&MISSION)
            .expect("no active mission");

        mission.owner.require_auth();

        if mission.completed {
            panic!("mission already claimed");
        }

        let token_client = token::Client::new(&env, &token_id);

        // Return only the principal, no reward
        token_client.transfer(
            &env.current_contract_address(),
            &mission.owner,
            &mission.amount,
        );

        // Remove mission from storage
        env.storage().instance().remove(&MISSION);

        env.events().publish(
            (symbol_short!("withdraw"), mission.owner),
            mission.amount,
        );
    }

    /// Read current mission state (read-only)
    pub fn get_mission(env: Env) -> Mission {
        env.storage()
            .instance()
            .get(&MISSION)
            .expect("no active mission")
    }
}

#[cfg(test)]
mod test;
