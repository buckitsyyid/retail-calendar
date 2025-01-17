# Retail Calendar

A configurable merchandising and retail calendar generator. For a given year and configuration, generates merchandising calendar along with Gregorian boundaries. It can be used for generating all calendar types, including NRF 4-5-4 calendar, 4-4-5 calendar or Gregorian calendar.

## Installation

Using npm:

```shell
 $ npm i --save retail-calendar
```

## Usage:

Instantiate RetailCalendarFactory with preferred options.

```javascript
const {
  WeekCalculation,
  WeekGrouping,
  LastDayOfWeek,
  LastMonthOfYear,
  RetailCalendarFactory,
} = require('retail-calendar')

const calendar = new RetailCalendarFactory(
  {
    weekCalculation: WeekCalculation.LastDayNearestEOM,
    weekGrouping: WeekGrouping.Group454,
    lastDayOfWeek: LastDayOfWeek.Saturday,
    lastMonthOfYear: LastMonthOfYear.January,
    leapYearStrategy: LeapYearStrategy.DropLastWeek // deprecated: restated: false
  },
  2017,
)
```

A retail calendar either has 52 or 53 weeks.

```javascript
calendar.numberOfWeeks
calendar.year // Given year, 2017 in this case
```

A retail calendar always has 12 months.

```javascript
calendar.months
calendar.months[0].monthOfYear // Starts from 1, up to 12
```

A retail calendar has **quarter of year** and **week of quarter**

Both Month and Week has quarter information
```javascript
calendar.months[0].quarterOfYear // from 1 to 4
calendar.weeks[0].quarterOfYear // from 1 to 4
```

The week also has week of quarter:
```javascript
calendar.weeks[0].weekOfQuarter
```

Each month consist of complete weeks. Month boundaries are always at the end of week. End of week is given in `lastDayOfWeek` option. Number of weeks for each month is defined in `weekGrouping` option.

```javascript
// Week grouping is 454 which means
calendar.months[0].numberOfWeeks // 4
calendar.months[1].numberOfWeeks // 5
calendar.months[2].numberOfWeeks // 4

calendar.months[3].numberOfWeeks // 4
calendar.months[4].numberOfWeeks // 5
calendar.months[5].numberOfWeeks // 4
// Each quarter repeats the same pattern.

// Each month has an array of weeks it contains.
calendar.months[0].weeks
```

Each month start and end boundaries expressed in Gregorian calendar.

```javascript
// Date time of beginning of month.
// In this case Feb 5, 2017 12:00 AM
calendar.months[0].gregorianStartDate
// Date time of end of month.
// In this case March 5, 2017 11:59.999 PM
calendar.months[0].gregorianEndDate
```

All weeks in a retail calendar are also directly accessible.
Each week also has boundaries available in Gregorian calendar.

```javascript
calendar.weeks // All weeks in calendar.
calendar.weeks[0].gregorianStartDate // Date
calendar.weeks[0].gregorianEndDate // Date
```

### 53 week years

Based on given configuration, a year may contain 53 weeks.
This complicates comparing months to previous year. This case is handled specially based on the given [LeapYearStrategy](#LeapYearStrategy) option.

#### Restated

If `leapYearStrategy` is `LeapYearStrategy.Restated` 

FIRST week of year is "dropped". It doesn't belong the any month.

```javascript
// Restated calendar example.
// First week of year has no month.
// Note that first week's weekOfYear is -1.
calendar.numberOfWeeks // 53
calendar.weeks[0].weekOfYear // -1
calendar.weeks[0].weekOfMonth // -1
calendar.weeks[0].monthOfYear // -1

// First month still starts from first week
calendar.months[0].weeks[0].weekOfYear // 0
```

⚠ *previous versions of this library used the `restated: true` option to specify a Restated leap year strategy. This still works but is deprecated!* ⚠

#### Drop Last Week

If `leapYearStrategy` is `LeapYearStrategy.DropLastWeek`

LAST week of year is "dropped".

```javascript
// Restated calendar example.
// First week of year has no month.
calendar.weeks[52].weekOfYear // -1
calendar.weeks[52].weekOfMonth // -1
calendar.weeks[52].monthOfYear // -1

// First month starts from 1st week
calendar.months[0].weeks[0].weekOfYear // 0
```
⚠ *previous versions of this library used the `restated: false` option to specify a "Drop Last Week" leap year strategy. This still works but is deprecated!* ⚠

#### Add to Penultimate Month

If `leapYearStrategy` is `LeapYearStrategy.AddToPenultimateMonth`

extra week is "added" to the ELEVENTH month

If `leapYearStrategy` is `LeapYearStrategy.AddToLastMonth`
extra week is "added" to the TWELFTH month


```javascript
// AddToPenultimateMonth calendar example for 445 Calendar.
// 11th Month has 5 weeks instead of 4
calendar.months[10].weeks.length //5

// AddToLastMonth calendar example for 445 Calendar.
// 12th Month has 5 weeks instead of 4
calendar.months[11].weeks.length //5
```
### Options

#### LastDayOfWeek

Positive integer from 1 (Monday) to 7 (Sunday). Identifies on which day of week the calendar weeks end. Years, months, weeks of the retail calendar always ends on this day of week.

#### WeekCalculation

Identifies which method to use when calculating end of the retail calendar year.

See [4-4-5 Calendar](https://en.wikipedia.org/wiki/4%E2%80%934%E2%80%935_calendar) article for how both of these methods work.

- WeekCalculation.LastDayNearestEOM: Use the last end of retail week, nearest the end of last gregorian month in the year.

- WeekCalculation.LastDayBeforeEOM: Use the last end of retail week, before the end of last gregorian month in the year.

- WeekCalculation.LastDayBeforeEomExceptLeapYear: Use the last end of retail week, before the end of last gregorian month in the year. If next year is leap year (has 53 weeks), make this year leap year by moving end of this year by 1 week forward.

- WeekCalculation.FirstBOWOfFirstMonth: Use the first, beginning of week day, of the start month as the start day of year.

#### LastMonthOfYear

Specifies the month the year ends. Plan year is the Gregorian year of the first month.

For example if last month is January and given year is 2017. The last month of retail calendar is January 2018
If last month is December and given year is 2017. The last month of retail calendar is December 2017.

#### WeekGrouping

Specifies how many weeks each month has in a quarter.

- `WeekGrouping.Group454`: 1st month has 4 weeks, 2nd has 5, 3rd has 4. Repeats for each quarter.
- `WeekGrouping.Group544`: 1st month has 5 weeks, 2nd has 4, 3rd has 4. Repeats for each quarter.
- `WeekGrouping.Group445`: 1st month has 4 weeks, 2nd has 4, 3rd has 5. Repeats for each quarter.

#### LeapYearStrategy

`enum`

If the year is a leap year (in the context of a retail calendar that means it has 53 weeks)

* And `LeapYearStrategy.Restated` is selected, the first week is not included in any month.
* And `LeapYearStrategy.DropLastWeek` is selected, the last week is not included in any month.
* And `LeapYearStrategy.AddToPenultimateMonth` is selected, the extra week is added to the 11th month

This option has no effect on 52 week years.

#### restated [Deprecated]
⚠ *This option has been superseded by [LeapYearStrategy](#LeapYearStrategy)* ⚠

`boolean`. If true, in leap years, first week is not included in any month. Otherwise, in leap years, last week is not included in any month.

Has no effect on 52 week years.
