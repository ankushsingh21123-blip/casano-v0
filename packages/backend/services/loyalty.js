const { db } = require('../server');

async function updateOrderStreak(userId) {
    const { rows } = await db.query(
        'SELECT last_order_date, current_streak, max_streak, loyalty_points FROM users WHERE user_id=$1',
        [userId]
    );
    const user = rows[0];

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const last = user.last_order_date ? new Date(user.last_order_date).toDateString() : null;

    let newStreak = 1;
    if (last === yesterday) newStreak = user.current_streak + 1;
    else if (last === today) newStreak = user.current_streak;

    const maxStreak = Math.max(newStreak, user.max_streak || 0);
    const pointsEarned = 10 * newStreak; // Bonus points for keeping the streak alive

    await db.query(
        `UPDATE users SET last_order_date = NOW(), current_streak = $1, max_streak = $2, loyalty_points = loyalty_points + $3 WHERE user_id = $4`,
        [newStreak, maxStreak, pointsEarned, userId]
    );

    return { newStreak, pointsEarned };
}

module.exports = { updateOrderStreak };
