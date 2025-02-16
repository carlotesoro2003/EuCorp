import { supabase } from '../../supabaseClient';

/**
 * Dashboard data structure.
 */
export const dashboardData = {
    cards: [
        {
            title: 'Action Plans',
            value: '0', // Placeholder for dynamic value
            change: 12.5,
            icon: '🎯',
        },
        {
            title: 'Unmitigated Risks',
            value: '0', // Placeholder for dynamic value
            change: -2.4,
            icon: '⚠️',
        },
        {
            title: 'Opportunities',
            value: '0', // Placeholder for dynamic value
            change: 8.2,
            icon: '💡',
        },
        // {
        //     title: 'Users',
        //     value: '0', // Placeholder for dynamic value
        //     change: 5.1,
        //     icon: '👥',
        // },
    ],
    barChart: {
        goals: [
            'Strategic Goal 1',
            'Strategic Goal 2',
            'Strategic Goal 3',
            'Strategic Goal 4',
            'Strategic Goal 5',
        ],
        achieved: [75, 60, 85, 45, 65],
        notAchieved: [25, 40, 15, 55, 35],
    },
    riskData: {
        categories: ['Manpower', 'Financial', 'Technical', 'Operational'], // Ensure this exists
        datasets: {
            manpower: [30, 50, 20],
            financial: [45, 35, 20],
            technical: [25, 45, 30],
            operational: [35, 40, 25],
        },
    },
    opportunitiesData: {
        achieved: 0,
        notAchieved: 0,
        total: 0,
        labels: ['Achieved', 'Not Achieved'],
    },
    // recentEvents: [
    //     {
    //         title: 'New project milestone achieved',
    //         time: '2 hours ago',
    //         type: 'success',
    //     },
    //     {
    //         title: 'System maintenance scheduled',
    //         time: '5 hours ago',
    //         type: 'warning',
    //     },
    //     {
    //         title: 'Server capacity reached 90%',
    //         time: '8 hours ago',
    //         type: 'error',
    //     },
    //     {
    //         title: 'New team member onboarded',
    //         time: '1 day ago',
    //         type: 'success',
    //     },
    // ],
};

/**
 * Fetch and update the count of strategic goals directly in the dashboardData object.
 */
export const updateActionPlansCount = async (userId: string): Promise<void> => {
    try {
        // Get user's department ID from profiles
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('department_id')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        const departmentId = profileData?.department_id;

        // Get action plans for department
        const { data: actionPlansData, error: actionPlansError } =
            await supabase
                .from('plan_monitoring')
                .select('id')
                .eq('department_id', departmentId);

        if (actionPlansError) throw actionPlansError;

        const actionPlansCount = actionPlansData.length;
        dashboardData.cards[0].value = `${actionPlansCount}`;
    } catch (error) {
        console.error('Error updating action plans count:', error);
        dashboardData.cards[0].value = '0';
    }
};
export const updateOpportunitiesData = async () => {
    try {
        const { data, error } = await supabase
            .from('opt_monitoring')
            .select('is_accomplished');

        if (error) throw error;

        const achieved = data.filter((item) => item.is_accomplished).length;
        const total = data.length;

        dashboardData.opportunitiesData = {
            achieved,
            notAchieved: total - achieved,
            total,
            labels: ['Achieved', 'Not Achieved'],
        };
    } catch (error) {
        console.error('Error fetching opportunities:', error);
    }
};
/**
 * Fetch and update the count of unmitigated risks directly in the dashboardData object.
 */
export const updateDepartmentRisksCount = async (
    userId: string
): Promise<void> => {
    try {
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('department_id')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        const departmentId = profileData?.department_id;

        const { data: risksData, error: risksError } = await supabase
            .from('risk_monitoring')
            .select('id')
            .eq('department_id', departmentId)
            .eq('is_achieved', false);

        if (risksError) throw risksError;

        const risksCount = risksData.length;
        dashboardData.cards[1].value = `${risksCount}`;
    } catch (error) {
        console.error('Error updating department risks count:', error);
        dashboardData.cards[1].value = '0';
    }
};

/**
 * Fetch and update the count of opportunities directly in the dashboardData object.
 */
export const updateDepartmentOpportunitiesCount = async (
    userId: string
): Promise<void> => {
    try {
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('department_id')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        const departmentId = profileData?.department_id;

        const { data: opportunitiesData, error: opportunitiesError } =
            await supabase
                .from('opt_monitoring')
                .select('id')
                .eq('department_id', departmentId);

        if (opportunitiesError) throw opportunitiesError;

        const opportunitiesCount = opportunitiesData.length;
        dashboardData.cards[2].value = `${opportunitiesCount}`;
    } catch (error) {
        console.error('Error updating department opportunities count:', error);
        dashboardData.cards[2].value = '0';
    }
};

/**
 * Fetch and update the count of users directly in the dashboardData object.
 */
export const updateUsersCount = async (): Promise<void> => {
    try {
        const { data, error } = await supabase.from('profiles').select('id');
        if (error) throw error;

        const usersCount = data.length;
        dashboardData.cards[3].value = `${usersCount}`;
    } catch (error) {
        console.error('Error updating users count:', error);
        dashboardData.cards[3].value = '0 Users';
    }
};
