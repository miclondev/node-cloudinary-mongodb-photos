$('document').ready(function () {

    const likeButton = $('.like-photo')
    const likeCount = $('#user-like-count')
    const cartCount = $('#user-cart-count')
    const cartButton = $('.cart-button')

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

    cartButton.click(function () {
        const photoId = $(this).attr('data-id')
        let thisCartButton = $(this)
        thisCartButton.html('<i class="fa fa-spin fa-circle-o-notch"> </i>')
        $.post('/user/add-to-cart', { photoId }, function (data) {
            if (data === 'added') {
                console.log(data)
                cartCount.text(parseInt(cartCount.text()) + 1)
                thisCartButton.html('<i class="fa fa-check"> </i>')
            }
        })
    })
})