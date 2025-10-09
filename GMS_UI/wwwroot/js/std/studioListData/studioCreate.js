let currentStep = 1;
const totalSteps = 9;

function changeStep(direction) {
    if (direction === 1) {
        // Validate current step before proceeding
        if (!validateStep(currentStep)) {
            return;
        }
    }

    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');

    // Update step indicator
    const currentIndicator = document.getElementById(`step${currentStep}-indicator`);
    if (direction === 1) {
        currentIndicator.classList.remove('active');
        currentIndicator.classList.add('completed');
        currentIndicator.innerHTML = '<i class="fas fa-check"></i>';

        if (currentStep < totalSteps) {
            const line = document.getElementById(`line${currentStep}`);
            line.classList.add('completed');
        }
    } else {
        currentIndicator.classList.remove('completed');
        currentIndicator.classList.add('active');
        currentIndicator.innerHTML = currentStep;
    }

    currentStep += direction;

    // Show new step
    const newStepElement = document.getElementById(`step${currentStep}`);
    newStepElement.classList.add('active');

    // Update new step indicator
    const newIndicator = document.getElementById(`step${currentStep}-indicator`);
    if (direction === 1) {
        newIndicator.classList.add('active');
    }

    // Update navigation buttons
    updateNavigationButtons();

    // Update review summary on last step
    if (currentStep === totalSteps) {
        updateReviewSummary();
    }
}

function goToStep(step) {
    const elements = document.querySelectorAll(".wizard-step");
    let eStep

    elements.forEach((element) => {
        if (element.id == `step${step}`) {
            element.classList.add('active')
        } else {
            element.classList.remove('active')
        }
    });

    const indicators = document.querySelectorAll(".step-circle");

    indicators.forEach((element) => {
        eStep = parseInt(element.id.replace('step', ''));
        if (eStep < step) {
            const line = document.getElementById(`line${eStep}`);
            if (!validateStep(eStep)) {
                element.classList.add('fail')
                element.classList.remove('completed')
                element.innerHTML = '<i class="fas fa-times"></i>';
                line.classList.add('fail');
                line.classList.remove('completed');
            }
            else {
                element.classList.add('completed')
                element.classList.remove('fail')
                element.innerHTML = '<i class="fas fa-check"></i>';
                line.classList.add('completed');
                line.classList.remove('fail');
            }
        }
        if (element.id == `step${step}-indicator`) {
            element.classList.add('active')
        } else {
            element.classList.remove('active')
        }
    });

    currentStep = step;

}

function validateStep(step) {
    //const stepElement = document.getElementById(`step${step}`);
    //const requiredFields = stepElement.querySelectorAll('[required]');
    let isValid = true;

    //requiredFields.forEach(field => {
    //    if (!field.value.trim()) {
    //        field.classList.add('is-invalid');
    //        isValid = false;
    //    } else {
    //        field.classList.remove('is-invalid');
    //    }
    //});

    //if (!isValid) {
    //    alert('Please fill in all required fields before proceeding.');
    //}

    if (step == 3)
        return false;

    return isValid;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
}

function updateReviewSummary() {
    //const summary = document.getElementById('reviewSummary');
    //const studyTitle = document.querySelector('[name="StudyTitle"]').value;
    //const studyPhase = document.querySelector('[name="StudyPhase"]').value;
    //const studyType = document.querySelector('[name="StudyType"]').value;
    //const principalInvestigator = document.querySelector('[name="PrincipalInvestigator"]').value;
    //const targetEnrollment = document.querySelector('[name="TargetEnrollment"]').value;
    //const sponsorName = document.querySelector('[name="SponsorName"]').value;

    //summary.innerHTML = `
    //        <strong>Study Title:</strong> ${studyTitle}<br>
    //        <strong>Phase:</strong> ${studyPhase}<br>
    //        <strong>Type:</strong> ${studyType}<br>
    //        <strong>Principal Investigator:</strong> ${principalInvestigator}<br>
    //        <strong>Target Enrollment:</strong> ${targetEnrollment} participants<br>
    //        <strong>Sponsor:</strong> ${sponsorName}
    //    `;
}

// Initialize navigation buttons
updateNavigationButtons();

//#region Starting Page...
$(function () {

    const blinding = JSON.parse($("#blindingType").val());

    setCombos("#blidingList", blinding, -1);

    const phase = JSON.parse($("#phaseType").val());

    setCombos("#phaseList", phase, -1);

    const randomization = JSON.parse($("#randomizationType").val());

    setCombos("#randomizationList", randomization, -1);

    const studystatus = JSON.parse($("#studioStatus").val());

    setCombos("#studystatusList", studystatus, -1);

    const sponsorId = $("#sponsorId").val()

    getSponsor(-1);

});

function getSponsor(selectedValue) {
    $.ajax({
        type: "POST",
        url: urlIndexSponsor + '?handler=SponsorDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#sponsorList", data.data, selectedValue);
        },
        failure: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function getCRO(selectedValue) {
    $.ajax({
        type: "POST",
        url: urlIndexReferenceData + '?handler=CRODropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#croList", data.data, selectedValue);
        },
        failure: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function getDisease(selectedValue) {
    $.ajax({
        type: "POST",
        url: urlIndexReferenceData + '?handler=DiseaseDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#diseaseList", data.data, selectedValue);
        },
        failure: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function getMonitorList(sponsorId) {
    $.ajax({
        type: "POST",
        url: urlIndexReferenceData + '?handler=DiseaseDropList',
        headers: { 'RequestVerificationToken': window._csrfToken },
        data: { "sponsorId": sponsorId },
        success: function (data) {
            // Clear existing options (optional)

            setCombos("#diseaseList", data.data, selectedValue);
        },
        failure: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        },
        error: function (response) {
            $('#failedTitle').html('Sponsor');
            $('#failedMsg').html('Sponsor failed. Please try again');
            $('#failedAlert').show();
        }
    });
}

function setCombos(comboName, values, selectedValue) {
    //empty combo
    $(comboName).empty();

    $.each(values, function (index, item) {
        if (item.id == selectedValue) {
            $(comboName).append($(`<option value=${item.id} selected="selected">${item.name}</option>`))
        }
        else {
            $(comboName).append($('<option>', {
                value: item.id,
                text: item.name
            }));
        }

    });
}