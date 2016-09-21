// Studentlist data array for filling in info box
var studentListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Student Name link click
    $('#studentList table tbody').on('click', 'td a.linkshowstudent', showStudentInfo);
    
    // Add Student button click
    $('#btnAddStudent').on('click', addStudent);

    // Update Student button click
    $('#btnUpdateStudent').on('click', updateStudent);

    // Delete Student link click
    $('#studentList table tbody').on('click', 'td a.linkdeletestudent', deleteStudent);
    
    // Populate the Student table on initial page load
    populateTable();

       // Show Student Info
        function showStudentInfo(event) {

            // Prevent Link from Firing
            event.preventDefault();

            // Retrieve username from link rel attribute
            var thisStudentName = $(this).attr('rel');

            // Get Index of object based on id value
            var arrayPosition = studentListData.map(function(arrayItem) { return arrayItem.fullname; }).indexOf(thisStudentName);

            // Get our Student Object
            var thisStudentObject = studentListData[arrayPosition];

            //Populate Info Box
            $('#studentInfoName').text(thisStudentObject.fullname);
            $('#studentInfoAge').text(thisStudentObject.age);
            $('#studentInfoGender').text(thisStudentObject.gender);
            $('#studentInfoLocation').text(thisStudentObject.address);

            // New Code show student information in textbox
            $('#addStudent fieldset input#inputStudentID').val(thisStudentObject.st_id);
            $('#addStudent fieldset input#inputStudentFullName').val(thisStudentObject.fullname);
            $('#addStudent fieldset input#inputStudentAge').val(thisStudentObject.age);
            $('#addStudent fieldset input#inputStudentAddress').val(thisStudentObject.address);
            $('#addStudent fieldset input#inputStudentGender').val(thisStudentObject.gender);
            $('#addStudent fieldset input#inputStudentEmail').val(thisStudentObject.email); 
        };
});

// Functions =============================================================
// Add Student
function addStudent(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addStudent input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        // If it is, compile all student info into one object
        var newStudent = {
            'st_id': $('#addStudent fieldset input#inputStudentID').val(),
            'fullname': $('#addStudent fieldset input#inputStudentFullName').val(),
            'age': $('#addStudent fieldset input#inputStudentAge').val(),
            'address': $('#addStudent fieldset input#inputStudentAddress').val(),
            'gender': $('#addStudent fieldset input#inputStudentGender').val(),
            'email': $('#addStudent fieldset input#inputStudentEmail').val()
        }

        // Use AJAX to post the object to our addStudent service
        $.ajax({
            type: 'POST',
            data: newStudent,
            url: '/users/addstudent',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addStudent fieldset input').val('');

                // Update the table
                populateTable();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {

        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Update Student
function updateStudent(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addStudent input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all student info into one object
        var modifiedStudent = {
            'st_id': $('input#inputStudentID').val(),
            'fullname': $('input#inputStudentFullName').val(),
            'age': $('input#inputStudentAge').val(),
            'address': $('input#inputStudentAddress').val(),
            'gender': $('input#inputStudentGender').val(),
            'email': $('input#inputStudentEmail').val()
        }

        // Use AJAX to post the object to our updateStudent service
        $.ajax({
            type: 'put',
            data: modifiedStudent,
            url: '/users/updatestudent',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addStudent fieldset input').val('');

                // Update the table
                populateTable();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {

        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Student
function deleteStudent(event) {
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Apakah anda ingin menghapus data ini ?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deletestudent/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
        });
    }
    else {

        // If they said no to the confirm, do nothing
        return false;
    }
};

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/studentlist',function(data) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            // Stick our user data array into a studentlist variable in the global object
            studentListData = data;
            tableContent += '<tr>';
            tableContent += '<td>' + this.st_id + '</td>';
            tableContent += '<td><a href="#" class="linkshowstudent" rel="' + this.fullname + '" title="Show Details">' + this.fullname + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeletestudent" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
            // Stick our user data array into a studentlist variable in the global object
        });
        // Inject the whole content string into our existing HTML table
        $('#studentList table tbody').html(tableContent);
    });
};
 