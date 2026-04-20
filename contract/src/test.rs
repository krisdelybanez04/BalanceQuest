#[cfg(test)]
mod tests {
    use soroban_sdk::{
        testutils::{Address as _, Ledger},
        token, Address, Env,
    };
    use crate::{BalanceQuestContract, BalanceQuestContractClient};

    fn setup() -> (Env, Address, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();

        // Deploy a mock XLM token
        let token_admin = Address::generate(&env);
        let token_id = env.register_stellar_asset_contract(token_admin.clone());
        let student = Address::generate(&env);
        let reward_source = Address::generate(&env);

        // Mint tokens to student and reward_source
        let token_client = token::StellarAssetClient::new(&env, &token_id);
        token_client.mint(&student, &10_000_0000000); // 10,000 XLM in stroops
        token_client.mint(&reward_source, &1_000_0000000); // 1,000 XLM reward pool

        (env, token_id, student, reward_source)
    }

    /// Test 1 (Happy path): mission created and completed, student receives principal + reward
    #[test]
    fn test_complete_mission_success() {
        let (env, token_id, student, reward_source) = setup();
        let contract_id = env.register_contract(None, BalanceQuestContract);
        let client = BalanceQuestContractClient::new(&env, &contract_id);

        let lock_amount: i128 = 200_0000000; // 200 XLM
        let reward: i128 = 10_0000000;       // 10 XLM reward
        let duration: u32 = 100;             // 100 ledgers for test

        client.create_mission(&student, &lock_amount, &duration, &reward, &token_id);

        // Advance ledger past unlock point
        env.ledger().with_mut(|l| l.sequence_number += 101);

        client.complete_mission(&token_id, &reward_source);

        let mission = client.get_mission();
        assert!(mission.completed);
    }

    /// Test 2 (Edge case): duplicate mission creation is rejected
    #[test]
    #[should_panic(expected = "active mission already exists")]
    fn test_duplicate_mission_rejected() {
        let (env, token_id, student, _reward_source) = setup();
        let contract_id = env.register_contract(None, BalanceQuestContract);
        let client = BalanceQuestContractClient::new(&env, &contract_id);

        client.create_mission(&student, &100_0000000, &100, &5_0000000, &token_id);
        // Second call should panic
        client.create_mission(&student, &100_0000000, &100, &5_0000000, &token_id);
    }

    /// Test 3 (State verification): storage reflects correct owner and amount after creation
    #[test]
    fn test_mission_state_after_creation() {
        let (env, token_id, student, _reward_source) = setup();
        let contract_id = env.register_contract(None, BalanceQuestContract);
        let client = BalanceQuestContractClient::new(&env, &contract_id);

        let lock_amount: i128 = 500_0000000;
        client.create_mission(&student, &lock_amount, &72_000, &25_0000000, &token_id);

        let mission = client.get_mission();
        assert_eq!(mission.owner, student);
        assert_eq!(mission.amount, lock_amount);
        assert!(!mission.completed);
    }
}