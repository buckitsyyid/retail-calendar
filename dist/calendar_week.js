"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarWeek = void 0;
var CalendarWeek = /** @class */ (function () {
    function CalendarWeek(weekOfYear, weekOfMonth, weekOfQuarter, monthOfYear, quarterOfYear, gregorianStartDate, gregorianEndDate) {
        this.weekOfYear = weekOfYear;
        this.weekOfQuarter = weekOfQuarter;
        this.weekOfMonth = weekOfMonth;
        this.monthOfYear = monthOfYear;
        this.quarterOfYear = quarterOfYear;
        this.gregorianStartDate = gregorianStartDate;
        this.gregorianEndDate = gregorianEndDate;
    }
    return CalendarWeek;
}());
exports.CalendarWeek = CalendarWeek;
