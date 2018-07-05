$('document').ready(function () {

    const likeButton = $('.like-photo')
    const likeCount = $('#user-like-count')
    
    likeButton.click(function () {
        const photoId = $(this).attr('data-id')
        let currentButton = $(this)
        $(this).html('<i class="fa fa-spin fa-circle-o-notch"> </i>')
        $.post('/user/like', { photoId }, function (data) {
            if (data === 'liked') {
                console.log(data)
                likeCount.text(parseInt(likeCount.text()) + 1)
                currentButton.html('<i class="fa fa-check"> </i>')
            }
        })
    })
})