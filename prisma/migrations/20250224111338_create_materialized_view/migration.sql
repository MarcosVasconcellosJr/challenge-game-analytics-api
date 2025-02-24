DROP MATERIALIZED VIEW IF EXISTS player_statistics;


CREATE MATERIALIZED VIEW player_statistics AS
SELECT
    p.id                                AS playerId,
    p.name                              AS playerName,
    SUM(pom."killVsDeathScore")::int    AS totalKillVsDeathScore,
    SUM(pom."fragScore")::int           AS totalFragScore,
    SUM(pom."deathCount")::int          AS totalDeathCount,
    SUM(pom."friendlyKillCount")::int   AS totalFriendlyKillCount,
    SUM(pom."killCount")::int           AS totalKillCount,
    SUM(pom."maxStreakCount")::int      AS totalMaxStreakCount,
    SUM(pom."totalKillCount")::int      AS totalTotalKillCount
FROM
    "player" p
JOIN "players-on-matchs" pom ON p.id = pom."playerId"
GROUP BY
    p.id, p.name
ORDER BY
    totalKillVsDeathScore desc,
    totalFragScore DESC;


CREATE UNIQUE INDEX idx_player_statistics ON player_statistics (playerId);