export const calculateProgressPercentage = (completed: number, target: number): number => {
    if (target <= 0) return 0;
    return (completed / target) * 100;
};
