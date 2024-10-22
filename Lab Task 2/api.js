$(document).ready(function () {
    loadStories(); // Initial load of stories

    $('#addStoryBtn').on('click', submitNewStory);
    $('#storyContainer').on('click', '.btn-remove', deleteStory);
    $('#storyContainer').on('click', '.btn-edit', startEditStory);
    $('#storyContainer').on('click', '.btn-save-changes', saveEditedStory);
});

// Fetch stories from the API
function loadStories() {
    $.get("https://usmanlive.com/wp-json/api/stories", function (response) {
        let storyContainer = $('#storyContainer');
        storyContainer.empty(); // Clear previous stories

        if (response.length === 0) {
            storyContainer.html("<p class='text-muted'>No stories to show. Please add one!</p>");
        } else {
            response.forEach(story => {
                storyContainer.append(`
                    <div class="story-item" data-id="${story.id}">
                        <h4>${story.title}</h4>
                        <p>${story.content}</p>
                        <input type="text" class="form-control mb-2 edit-title" value="${story.title}" style="display: none;">
                        <textarea class="form-control mb-2 edit-content" rows="3" style="display: none;">${story.content}</textarea>
                        <button class="btn btn-primary btn-sm btn-edit">Edit</button>
                        <button class="btn btn-success btn-sm btn-save-changes" style="display: none;">Save</button>
                        <button class="btn btn-danger btn-sm btn-remove">Delete</button>
                    </div>
                `);
            });
        }
    });
}

// POST new story to the API
function submitNewStory() {
    let title = $('#storyTitle').val().trim();
    let content = $('#storyBody').val().trim();

    if (!title || !content) {
        alert('Please provide both title and content.');
        return;
    }

    $.post("https://usmanlive.com/wp-json/api/stories", { title: title, content: content }, function () {
        $('#storyTitle').val(''); // Clear inputs
        $('#storyBody').val('');
        loadStories(); // Reload stories after submission
    });
}

// DELETE story from the API
function deleteStory() {
    let storyElement = $(this).closest('.story-item');
    let storyId = storyElement.data('id');

    $.ajax({
        url: `https://usmanlive.com/wp-json/api/stories/${storyId}`,
        method: "DELETE",
        success: function () {
            storyElement.remove(); // Remove story from UI
        }
    });
}

// Switch to edit mode
function startEditStory() {
    let storyElement = $(this).closest('.story-item');

    storyElement.find('h4, p').hide(); // Hide title and content
    storyElement.find('.edit-title, .edit-content').show(); // Show input fields

    $(this).hide(); // Hide "Edit" button
    storyElement.find('.btn-save-changes').show(); // Show "Save" button
}

// PUT updated story to the API
function saveEditedStory() {
    let storyElement = $(this).closest('.story-item');
    let storyId = storyElement.data('id');

    let updatedTitle = storyElement.find('.edit-title').val().trim();
    let updatedContent = storyElement.find('.edit-content').val().trim();

    if (!updatedTitle || !updatedContent) {
        alert('Both title and content are required.');
        return;
    }

    $.ajax({
        url: `https://usmanlive.com/wp-json/api/stories/${storyId}`,
        method: "PUT",
        data: { title: updatedTitle, content: updatedContent },
        success: function () {
            storyElement.find('h4').text(updatedTitle).show();
            storyElement.find('p').text(updatedContent).show();

            storyElement.find('.edit-title, .edit-content').hide(); // Hide input fields
            storyElement.find('.btn-save-changes').hide(); // Hide "Save" button
            storyElement.find('.btn-edit').show(); // Show "Edit" button
        }
    });
}