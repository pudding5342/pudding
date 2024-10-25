const uploaderInput = document.getElementById('uploader');
const homeworkInput = document.getElementById('homeworkInput');
const uploadDateInput = document.getElementById('uploadDate');
const dueDateInput = document.getElementById('dueDate');
const saveHomeworkButton = document.getElementById('saveHomework');
const homeworkList = document.getElementById('homeworkList');


saveHomeworkButton.addEventListener('click', function() {
    const uploader = uploaderInput.value.trim();
    const homeworkText = homeworkInput.value.trim();
    const uploadDate = uploadDateInput.value;
    const dueDate = dueDateInput.value;
    
    if (uploader && homeworkText && uploadDate && dueDate) {
        addHomework(uploader, uploadDate, homeworkText, dueDate);
        uploaderInput.value = ''; 
        homeworkInput.value = ''; 
        uploadDateInput.value = ''; 
        dueDateInput.value = ''; 
    } else {
        alert('請填寫所有欄位啦哪個字看不懂');
    }
});


function addHomework(uploader, uploadDate, text, dueDate) {
    const homeworkDiv = document.createElement('div');
    
    homeworkDiv.textContent = `上傳者：${uploader} | 上傳日期：${uploadDate} | 作業內容：${text} | 繳交日期：${dueDate}`;
    homeworkList.appendChild(homeworkDiv);
}
