
// 获取用户信息
exports.getInfoSql = (openId) => {
    return `select avatar,user_name,gender,open_id from t_user where open_id='${openId}';`
}

exports.getSelectUserWorkSql = (openId) => {
    return `SELECT 
    t_work.open_id,
    t_work.result,
    t_work.start_work_time,
    t_work.occupation,
    t_work.ditto,
    t_work.opposite_sex,
    t_work.work_env,
    t_work.qualification,
    t_work.hours_fish,
    t_work.commute_length,
    t_work.working_hours,
    t_work.average_daily_firewood,
    t_user.user_name,
    t_user.avatar,
    t_user.gender,
    ROW_NUMBER() OVER (ORDER BY t_work.result DESC) AS ranking
FROM 
    t_user
RIGHT 
    JOIN 
        t_work   
    ON 
        t_user.open_id = t_work.open_id
    WHERE 
        t_user.open_id ='${openId}';`
}

// 插入数据到排行榜表
exports.getInsertWorkSql = (body) => {
    const {
        averageDailyFirewood,
        workingHours,
        commuteLength,
        hoursFish,
        qualification,
        workEnv,
        oppositeSex,
        ditto,
        occupation,
        startWorkTime,
        result,
        openId
    } = body
    return `INSERT INTO t_work (
        open_id,
        result,
        start_work_time,
        occupation,
        ditto,
        opposite_sex,
        work_env,
        qualification,
        hours_fish,
        commute_length,
        working_hours,
        average_daily_firewood)
        VALUES ('${openId}',
            ${result},
            ${startWorkTime},
            ${occupation},
            ${ditto},
            ${oppositeSex},
            ${workEnv},
            ${qualification},
            ${hoursFish},
            ${commuteLength},
            ${workingHours},
            ${averageDailyFirewood}
        )
        ON CONFLICT (open_id) DO UPDATE SET 
        result = ${result}, 
        start_work_time = ${startWorkTime},
        occupation=${occupation},
        ditto=${ditto},
        opposite_sex=${oppositeSex},
        work_env=${workEnv},
        qualification=${qualification},
        hours_fish=${hoursFish},
        commute_length=${commuteLength},
        working_hours =  ${workingHours},
        average_daily_firewood = ${averageDailyFirewood}
        ;`
}


// 排行榜
exports.selectWorkSql = `SELECT 
   t_work.open_id,
    t_work.result,
    t_work.start_work_time,
    t_work.occupation,
    t_work.ditto,
    t_work.opposite_sex,
    t_work.work_env,
    t_work.qualification,
    t_work.hours_fish,
    t_work.commute_length,
    t_work.working_hours,
    t_work.average_daily_firewood,
    t_user.user_name,
    t_user.avatar,
    t_user.gender,
    ROW_NUMBER() OVER (ORDER BY t_work.result DESC) AS ranking
FROM 
    t_work
RIGHT 
    JOIN 
        t_user 
    ON 
        t_work.open_id = t_user.open_id 
    WHERE 
            result IS NOT NULL 
    ORDER BY 
            t_work.result 
    DESC 
    LIMIT 100;`