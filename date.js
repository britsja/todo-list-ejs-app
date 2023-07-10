
module.exports = getDate();

function getDate() {
    var today = new Date();
        
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];
    var weekend = "a weekend baby!"
    var dateValue = ""

    if (today.getDay() === 6 || today.getDay() === 0) {        
        dateValue = weekend;
    } else {
        dateValue = dayName;
    }

    return dateValue;
}

