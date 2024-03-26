GRANT USAGE, CREATE ON SCHEMA public TO mw_admin;
GRANT USAGE ON SCHEMA public TO mw_user;

CREATE TABLE IF NOT EXISTS PLAYER (
    player_id SERIAL PRIMARY KEY,
    player_name TEXT,
    balance DECIMAL
);

CREATE TABLE IF NOT EXISTS LOGIN (
    username VARCHAR (50) PRIMARY KEY,
    player_id INTEGER references PLAYER(player_id),
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS PERIOD (
    period_id SERIAL PRIMARY KEY,
    period_name TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS EVENT (
    event_id SERIAL PRIMARY KEY,
    event_name TEXT NOT NULL,
    event_time DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS EVENT_TEAM (
    event_team_id SERIAL PRIMARY KEY,
    event_team_name TEXT NOT NULL,
    event_id INTEGER references EVENT(event_id),
    event_win BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS WAGER (
    wager_id SERIAL PRIMARY KEY,
    wager_period_id INTEGER references PERIOD(period_id),
    team_choice_id INTEGER references EVENT_TEAM(event_team_id),
    wager_amount DECIMAL,
    wager_win BOOLEAN NOT NULL DEFAULT FALSE
);