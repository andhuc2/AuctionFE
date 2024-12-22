// Define the interface for the tournament configuration
interface ModeConfig {
    [key: string]: {
        maxPlayers: number[];
        maxTeamsPerMatch: number;
        maxPlayersPerTeam: number;
        maxTeams: number;
    };
}

// Create a constant with the defined structure
const TournamentConfig: ModeConfig = {
    BattleRoyale: {
        maxPlayers: [16,32,64],
        maxTeamsPerMatch: 8,
        maxPlayersPerTeam: 1,
        maxTeams: 16,
    },
    DeathMatch: {
        maxPlayers: [12],
        maxTeamsPerMatch: 2,
        maxPlayersPerTeam: 3,
        maxTeams: 4,
    },
};

export default TournamentConfig;
