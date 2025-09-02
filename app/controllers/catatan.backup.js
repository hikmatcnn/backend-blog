await sequelize.query(`
            SET TIME ZONE'Asia/Jakarta';
                SELECT
                    v3.ID,
                    v1.disdik_school_id,
                    v1.npsn,
                    v1.NAME,
                    UPPER ( v1."type" ) AS "bentuk",
                    UPPER ( v1."level" ) AS "jenjang",
                    v1.province_code,
                    v1.city_code,
                    v1.district_code,
                    v1.subdistrict_code,
                    v2.code,
                    cadisdik,
                    v4."name" AS type_options,
                    UPPER(mj."name") as major_name,
                    COALESCE (
                        SUM ( CASE WHEN x.first_option_id = v3.ID AND x.first_school_id = v1.ID THEN 1 ELSE 0 END ),
                        0 
                    ) AS jml_pendaftar_choice_1,
                    0::bigint AS jml_pendaftar_choice_2,
                    0::bigint AS jml_pendaftar_choice_3,
                    COALESCE (
                        SUM ( CASE WHEN x.accepted_choice_id = v3.ID AND x.accepted_school_id = v1.ID AND x.status IN ('register', 'accepted') THEN 1 ELSE 0 END ),
                        0 
                    ) AS jml_accepted,
                    v3.quota as quota_new,
                    CASE WHEN v4."name" = 'ZONASI' THEN COALESCE (
                        SUM ( CASE WHEN x.accepted_choice_id = v3.ID AND x.accepted_school_id = v1.ID AND x.status IN ('register', 'accepted', 'withdraw') AND x.is_get_special_quota = true THEN 1 ELSE 0 END ),
                        0 
                    ) ELSE 0 END AS special_quota,
                    CASE WHEN v4."name" = 'ZONASI' THEN (v3.quota + COALESCE (
                        SUM ( CASE WHEN x.accepted_choice_id = v3.ID AND x.accepted_school_id = v1.ID AND x.status IN ('register', 'accepted', 'withdraw') AND x.is_get_special_quota = true THEN 1 ELSE 0 END ),
                        0 
                    )) ELSE v3.quota END as total_quota_new,
                    CASE WHEN v4."name" = 'ZONASI' THEN (v3.quota + COALESCE (
                        SUM ( CASE WHEN x.accepted_choice_id = v3.ID AND x.accepted_school_id = v1.ID AND x.status IN ('register', 'accepted', 'withdraw') AND x.is_get_special_quota = true THEN 1 ELSE 0 END ),
                        0 
                    )) ELSE v3.quota END - COALESCE (
                        SUM ( CASE WHEN x.accepted_choice_id = v3.ID AND x.accepted_school_id = v1.ID AND x.status IN ('register', 'accepted') THEN 1 ELSE 0 END ),
                        0 
                    ) as quota_left,
                    '${time}' AS last_date,
                    '2024' AS tahun,
                    ${whatPhase} as phase
                FROM
                    registration.schools v1
                    LEFT JOIN REF.regions v2 ON v1.subdistrict_code = v2.code_disdik_subdistrict
                    LEFT JOIN registration.school_options v3 ON v1.ID = v3.school_id AND v3."type" IN ${listJalur}
                    INNER JOIN REF.jalur v4 ON v3."type" = v4.code
                    LEFT JOIN registration.registration x ON (x.first_school_id = v1.ID OR x.accepted_school_id = v1.ID)
                    LEFT JOIN registration.majors mj ON v3.major_id = mj.id
                    LEFT JOIN ref.junior_data jd ON jd.id = x.junior_id
                WHERE
                    v1.LEVEL IN ( 'sma', 'smk' ) 
                GROUP BY
                    v3.ID,
                    v1.disdik_school_id,
                    v1.npsn,
                    v1.NAME,
                    v4."name",
                    UPPER ( v1."type" ),
                    UPPER ( v1."level" ),
                    v1.province_code,
                    v1.city_code,
                    v1.district_code,
                    v1.subdistrict_code,
                    v2.code,
                    cadisdik,
                    v3.quota,
                    v3.total_quota_new,
                    mj."name",
                    v1.total_special_quota;
        `, {
            type: Sequelize.QueryTypes.SELECT,
            raw: true
        });