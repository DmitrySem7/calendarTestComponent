export function getWeekDayOfMonth(date: Date) {
    function isLeapYear(input: Date): boolean {
        const y = input.getFullYear();
        return new Date(y, 2, 0).getDate() === 29;
    }
    function getMonthCode(date: Date) {
        const MONTH_CODES = {
            1:[1, 4, 4, 0, 2, 5, 0, 3, 6, 1, 4, 6],
            0:[0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5]
        };
        let currentMonthCode = -1;
        if(isLeapYear(date)) {
            currentMonthCode = MONTH_CODES[1][date.getMonth()]!;
        } else {
            currentMonthCode = MONTH_CODES[0][date.getMonth()]!;
        }
        return currentMonthCode;
    }
    function getYearCode(date: Date) {
        const year = date.getFullYear();
        const yy = year % 100;
        return (6 + yy + Math.floor(yy / 4)) % 7;
    }
    function getDayOfWeek(date: Date) {
        const weekday = (1+getMonthCode(date)+getYearCode(date)) % 7;
        if (weekday === 0) {
            return 7;
        }else{
            return weekday;
        }
    }
    return getDayOfWeek(date);
}

export function countDaysInMonth(date: Date) {
 return 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
}