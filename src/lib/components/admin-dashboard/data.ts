import { supabase } from '../../supabaseClient';

/**
 * Dashboard data structure.
 */

// Add these types
interface DepartmentData {
    name: string;
    achieved: number;
    notAchieved: number;
}

interface StrategicGoalData {
    id: number;
    name: string;
    achieved: number;
    notAchieved: number;
    departments: DepartmentData[];
}

export const dashboardData = {
    cards: [
        {
            title: 'Strategic Goals',
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
        {
            title: 'Users',
            value: '0', // Placeholder for dynamic value
            change: 5.1,
            icon: '👥',
        },
    ],
    barChart: {
        goals: [] as string[],
        achieved: [] as number[],
        notAchieved: [] as number[],
        strategicGoals: [] as StrategicGoalData[],
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
    recentEvents: [
        {
            title: 'New project milestone achieved',
            time: '2 hours ago',
            type: 'success',
        },
        {
            title: 'System maintenance scheduled',
            time: '5 hours ago',
            type: 'warning',
        },
        {
            title: 'Server capacity reached 90%',
            time: '8 hours ago',
            type: 'error',
        },
        {
            title: 'New team member onboarded',
            time: '1 day ago',
            type: 'success',
        },
    ],
};

export const updateBarChartData = async (): Promise<void> => {
    try {
        // Fetch strategic goals with their action plans
        const { data: goals, error: goalsError } = await supabase
            .from('strategic_goals')
            .select(
                `
                id,
                name,
                goal_no,
                strategic_objectives (
                    id,
                    action_plans (
                        id,
                        plan_monitoring (
                            is_accomplished
                        )
                    )
                )
            `
            )
            .order('goal_no');

        if (goalsError) throw goalsError;

        const processedGoals = goals.map((goal) => {
            const allPlans = goal.strategic_objectives.flatMap((obj) =>
                obj.action_plans.flatMap((plan) => plan.plan_monitoring)
            );

            return {
                id: goal.id,
                name: `Goal ${goal.goal_no}: ${goal.name}`,
                achieved: allPlans.filter((plan) => plan.is_accomplished)
                    .length,
                notAchieved: allPlans.filter((plan) => !plan.is_accomplished)
                    .length,
                departments: [],
            };
        });

        dashboardData.barChart = {
            goals: processedGoals.map((g) => g.name),
            achieved: processedGoals.map((g) => g.achieved),
            notAchieved: processedGoals.map((g) => g.notAchieved),
            strategicGoals: processedGoals,
        };
    } catch (error) {
        console.error('Error updating bar chart data:', error);
    }
};

export const fetchDepartmentDataForGoal = async (
    goalId: number
): Promise<DepartmentData[]> => {
    try {
        const { data: departments, error } = await supabase
            .from('departments')
            .select(
                `
                id,
                name,
                profiles (
                    action_plans!inner (
                        id,
                        plan_monitoring (
                            is_accomplished
                        ),
                        strategic_objectives!inner (
                            strategic_goal_id
                        )
                    )
                )
            `
            )
            .filter(
                'profiles.action_plans.strategic_objectives.strategic_goal_id',
                'eq',
                goalId
            );

        if (error) throw error;

        return departments
            .filter((dept) =>
                dept.profiles.some((profile) => profile.action_plans.length > 0)
            )
            .map((dept) => {
                const allPlans = dept.profiles.flatMap((profile) =>
                    profile.action_plans.flatMap((plan) => plan.plan_monitoring)
                );

                return {
                    name: dept.name,
                    achieved: allPlans.filter((plan) => plan.is_accomplished)
                        .length,
                    notAchieved: allPlans.filter(
                        (plan) => !plan.is_accomplished
                    ).length,
                };
            });
    } catch (error) {
        console.error('Error fetching department data:', error);
        return [];
    }
};
/**
 * Fetch and update the count of strategic goals directly in the dashboardData object.
 */
export const updateStrategicGoalsCount = async (): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('strategic_goals')
            .select('id');
        if (error) throw error;

        const strategicGoalsCount = data.length;
        dashboardData.cards[0].value = `${strategicGoalsCount}`;
    } catch (error) {
        console.error('Error updating strategic goals count:', error);
        dashboardData.cards[0].value = '0 Goals';
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
export const updateUnmitigatedRisksCount = async (): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('risk_monitoring')
            .select('id', { count: 'exact' })
            .eq('is_achieved', false);

        if (error) throw error;

        const unmitigatedRisksCount = data.length;
        dashboardData.cards[1].value = `${unmitigatedRisksCount}`;
    } catch (error) {
        console.error('Error updating unmitigated risks count:', error);
        dashboardData.cards[1].value = '0 Risks';
    }
};

/**
 * Fetch and update the count of opportunities directly in the dashboardData object.
 */
export const updateOpportunitiesCount = async (): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('opt_monitoring')
            .select('id');
        if (error) throw error;

        const opportunitiesCount = data.length;
        dashboardData.cards[2].value = `${opportunitiesCount}`;
    } catch (error) {
        console.error('Error updating opportunities count:', error);
        dashboardData.cards[2].value = '0 Opportunities';
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
