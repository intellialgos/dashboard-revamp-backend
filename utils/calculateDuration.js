export function calculateDuration(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const diffInMilliseconds = endDate - startDate;
  
    const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);
  
    return `${hours}:${minutes}:${seconds}`;
}

export function sortByRectificationTime(arr) {
    return arr.sort((a, b) => {
      const parseTimeToSeconds = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };
  
      const timeA = parseTimeToSeconds(a.rectification_time);
      const timeB = parseTimeToSeconds(b.rectification_time);
  
      return timeA - timeB; // Sort in ascending order
    });
}

export function convertDurationToMinutes(duration) {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    
    // Convert hours to minutes and add the minutes and seconds (converted to minutes)
    const totalMinutes = hours * 60 + minutes + Math.floor(seconds / 60);
    
    return totalMinutes;
}

export function convertDurationToSeconds(duration) {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    
    // Convert hours and minutes to seconds and add them to the seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    return totalSeconds;
}