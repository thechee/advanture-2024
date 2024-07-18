import { format, getYear } from 'date-fns'

export const dateRangeFormatter = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    const startYear = getYear(startDateObj);
    const endYear = getYear(endDateObj);

    const startDate = format(startDateObj, 'MMM dd');
    const endDate = format(endDateObj, 'MMM dd, yyyy');

    // Include the start year in the startDate string if different from the end year
    const startDateString = `${startDate}${startYear < endYear ? `, ${startYear}` : ''}`;

    return `${startDateString} - ${endDate}`
}