$('document').ready(function () {

    //     the following functions and variables are to handle when
    //     someone clicks the like button and the add to cart button
    //create the function the enable it when page loads
    function enablePhotofuncs() {
        let likeButton = $('.like-photo')
        const likeCount = $('#user-like-count')
        const cartCount = $('#user-cart-count')
        let cartButton = $('.cart-button')

        likeButton.click(function () {
            const photoId = $(this).attr('data-id')
            let currentButton = $(this)
            $(this).html('<i class="fa fa-spin fa-circle-o-notch"> </i>')
            $.post('/user/like', { photoId }, function (data) {
                if (data === 'liked') {
                    console.log(data)
                    likeCount.text(parseInt(likeCount.text()) + 1)
                    currentButton.html('<i class="fa fa-check"> </i>')
                    setTimeout(function(){
                        currentButton.hide()
                    }, 1000)
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
                    setTimeout(function(){
                        thisCartButton.hide()
                    }, 1000)
                }
            })
        })
    }

    enablePhotofuncs()

    //handle photo changes
    const selectSort = $('#select-sort')
    const selectCat = $('#select-category')

    // selectSort.val('likes')

    let selectedCat = 'All'
    let selectedSort = 'recommended'
    const mainUrl = $(location).attr('href').split('?')[0]
    let skip = 0
    let generatedUrl = `/photos/json?category=${selectedCat}&sort=${selectedSort}&skip=${skip}`
    // let navUrl = `${mainUrl}/?category=${selectedCat}&sort=${selectedSort}`
    const photoContainer = $('#photos-container')

    function addPhotos(container, images) {
        images.forEach(image =>
            container.append(
                `
    <div class="col-lg-3 col-md-6">
    <div class="card">
        <div class="el-card-item">
            <div class="el-card-avatar el-overlay-1 image-hover-overlay">
                <img style="min-height: 170px" src="https://res.cloudinary.com/adgallerytz/image/upload/c_scale,w_400/c_crop,g_face:auto,h_264,w_396/v1528874042/photos/${image.image.name}"
                    alt="adgallery">
                <div class="el-overlay">
                    <div class="photo-user">
                    <p><i class="fa fa-heart"> </i> ${image.likes}</p>
                        <p> By:
                            ${image.user.username}
                        </p>
                    </div>
                    <ul class="el-info">
                                <li>
                                    <a class="btn default btn-outline like-photo" data-id="${image._id}">
                                        <i class="fa fa-heart"></i>
                                    </a>
                                </li>
             
                                        <li>

                                            <a class="btn default btn-outline cart-button" data-id="${image._id}">
                                                <i class="fa fa fa-shopping-basket"></i>
                                            </a>
                                        </li>
                             
                                                <li>
                                                    <a class="btn default btn-outline" href="/photos/${image.slug}">
                                                        <i class="icon-link"></i>
                                                    </a>
                                                </li>

                    </ul>
                </div>
            </div>

        </div>
    </div>
</div>
    `));
    }
    let loaded = 0


    const loadMoreButton = $('#load-more-button')
    loadMoreButton.click(function () {
        console.log('trying to skip')
        skip = skip + 24
        generatedUrl = `/photos/json?category=${selectedCat}&sort=${selectedSort}&skip=${skip}`
        console.log(skip)
        $('.gallery-100').LoadingOverlay("show")
        loadImages()
    })



    function loadImages() {
        $.get(generatedUrl, function (data) {
            console.log(data)
            if (data) {
                console.log(`skip`, skip)
                if (data.images.length === 0) {
                    $('#photos-load-more').hide()
                } else {
                    $('#photos-load-more').show()
                }
                if (loaded === 0) {
                    photoContainer.html(' ')
                }
                loaded = loaded + 1
                console.log(`num of times loaded ${loaded}`)
                addPhotos(photoContainer, data.images)
                $('#photos-pagination').hide()
                $('.gallery-100').LoadingOverlay("hide")
                enablePhotofuncs()
                let likeButton = $('.like-photo')
                let cartButton = $('.cart-button')

                likeButton.each(function () {
                    let button = $(this)
                    console.log(button.attr('data-id'))
                    if(data.like.indexOf(button.attr('data-id')) > -1){
                        $(this).hide()
                    }
                })

                cartButton.each(function () {
                    let button = $(this)
                    console.log(button.attr('data-id'))
                    if(data.like.indexOf(button.attr('data-id')) > -1){
                        $(this).hide()
                    }
                })

                const imagesHover = $('.el-overlay')
                let prevHover

                imagesHover.hover(function(){
                    if(prevHover === undefined){
                        prevHover = $(this)
                    }else{
                        prevHover.removeClass('image-hover-overlay')
                        prevHover = $(this)
                    }
                    $(this).addClass('image-hover-overlay')  
                })

            }
        })
    }

    selectSort.change(function () {
        skip = 0
        loaded = 0
        selectedSort = $(this).val()
        generatedUrl = `/photos/json?category=${selectedCat}&sort=${selectedSort}&skip=${skip}`
        console.log(generatedUrl)
        $('.gallery-100').LoadingOverlay("show")
        loadImages()
    })

    selectCat.change(function () {
        skip = 0
        loaded = 0
        selectedCat = $(this).val()
        generatedUrl = `/photos/json?category=${selectedCat}&sort=${selectedSort}&skip=${skip}`
        console.log(generatedUrl)
        $('.gallery-100').LoadingOverlay("show")
        loadImages()
    })

    generatedUrl = `/photos/json?category=All&sort=latest&skip=${skip}`
    loadImages()
})