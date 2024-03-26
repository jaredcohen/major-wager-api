const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Player = sequelize.define( "Player", {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 100.00
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    defaultScope: {
        attributes: { exclude: ['password'] }
    }
});

const Wager = sequelize.define( "Wager", {
    wagerAmount: {
        type: DataTypes.DECIMAL(9,2),
        allowNull: false
    },
    wagerWin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

const EventTeam = sequelize.define( "EventTeam", {
    eventTeamName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    eventTeamMultiplier: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    eventWin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

const Event = sequelize.define( "Event", {
    eventName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    eventStart: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

const Period = sequelize.define( "Period", {
    periodName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    periodStart: {
        type: DataTypes.DATE,
        allowNull: false
    },
    periodEnd: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

Player.Wagers = Player.hasMany(Wager);
Wager.Player = Wager.belongsTo(Player);

Period.Events = Period.hasMany(Event);
Event.Period = Event.belongsTo(Period);
Event.EventTeams = Event.hasMany(EventTeam);
EventTeam.Event = EventTeam.belongsTo(Event);

Wager.EventTeam = Wager.hasOne(EventTeam);
EventTeam.Wager = EventTeam.hasMany(Wager);

exports.Player = Player;
exports.Wager = Wager;
exports.Period = Period;
exports.Event = Event;
exports.EventTeam = EventTeam;