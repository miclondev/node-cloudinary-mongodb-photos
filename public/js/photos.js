$('document').ready(function () {

    //handle photo changes
    const selectSort = $('#select-sort')
    const selectCat = $('#select-category')

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
            <a href="/photos/${image._id}">
                <img style="min-height: 170px" src="https://res.cloudinary.com/adgallerytz/image/upload/c_scale,w_400/c_crop,g_face:auto,h_264,w_396/v1528874042/photos/${image.image.name}"
                alt="adgallery">
                </a> 
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

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    const loadCategory = getUrlParameter('category')
    selectCat.val(loadCategory)
    selectedCat = loadCategory
    generatedUrl = `/photos/json?category=${selectedCat}&sort=${selectedSort}&skip=${0}`
    loadImages()

    const loadMoreButton = $('#load-more-button')
    loadMoreButton.click(function () {
        console.log('trying to skip')
        skip = skip + 24
        generatedUrl = `/photos/json?category=${selectedCat}&sort=${selectedSort}&skip=${skip}`
        console.log(skip)
        loadMoreButton.html('<i class="fa fa-spin fa-spinner"></i>')
        loadImages()
    })



    function loadImages() {
        $.get(generatedUrl, function (data) {
            console.log(data)
            if (data.images) {
                loadMoreButton.html('Load More')
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
                    //console.log(data.like)
                    // console.log(button.attr('data-id'), data.like.indexOf(button.attr('data-id')) > -1)
                    if (data.like === undefined) {
                        $(this).hide()
                    } else {
                        if (data.like.indexOf(button.attr('data-id')) > -1) {
                            $(this).hide()
                        }
                    }
                })

                cartButton.each(function () {
                    let button = $(this)
                    if (data.cart === undefined) {
                        $(this).hide()
                    } else {
                        if (data.like.indexOf(button.attr('data-id')) > -1) {
                            $(this).hide()
                        }
                    }
                })

                const imagesHover = $('.el-overlay')
                let prevHover

                imagesHover.hover(function () {
                    if (prevHover === undefined) {
                        prevHover = $(this)
                    } else {
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

    const mobileSearch = $('#mobile-search')
    const mobileOptions = $('.mobile-options')

    mobileSearch.click(function () { 
        //mobileSearch.hide()
        mobileOptions.hide()
       $('#mobile-search-location').show()

       $('.dismiss-button').click(function() {
           mobileOptions.show()
           $('#mobile-search-location').hide()
       })
    })

})