$(document).ready(function () {

    let selected = []
    const selectable = $('.selectable')
    const togglemulti = $('#togglemulti')

    togglemulti.click(function () {
        selectable.each(function () {

            if ($(this).is(':visible')) {
                $(this).css({ 'display': "none" })
                togglemulti.html('select')
            } else {
                $(this).css({ 'display': "block" })
                togglemulti.html(`<span>(${selected.length})</span> selected`)
            }
        })
    })

    const photoId = $('.photo-id')
    const toggleSpan = $('#toggle-span')

    console.log(photoId.first().val())
    const editvalues = $('#multi-edit input')

    photoId.on('change', function () {
        if (this.checked) {
            selected.push(this.value)
            editvalues.val(selected)
            togglemulti.html(`<span>(${selected.length})</span> selected`)
            console.log(selected)
        } else {
            const val = selected.indexOf(this.value)
            selected.splice(val, 1)
            editvalues.val(selected)
            togglemulti.html(`<span>(${selected.length})</span> selected`)
            console.log(selected)
        }
    })

    const approveForm = $('#approve-form')
    const unapproveForm = $('#unapprove-form')
    const deleteForm = $('#multi-delete-form')

    approveForm.submit(function (e) {
        e.preventDefault()
        $.post('/admin/multi/approve', { ids: selected }, function (data) {
            if (data === 'successful') {
                location.reload()
            } else {
                alert('could not update')
            }
        })
    })

    deleteForm.submit(function (e) {
        e.preventDefault()
        $.post('/admin/multi/delete', { ids: selected }, function (data) {
            if (data === 'successful') {
                location.reload()
            } else {
                alert('could not delete')
            }
        })
    })

    const homeImage = $('#home-image')
    homeImage.mouseenter(function () {
        console.log('mouse enters')
        $('.home-image-change').show()
    })

    $('.home-image-change').mouseleave(function () {
        $('.home-image-change').hide()
    })


    let skip = 0
    const nextButton = $('#next-button')
    const prevButton = $('#prev-button')
    const imageContainer = $('#images-container')
    let selectedImages
    let featuredImage
    const Spinner = $('#collection-spinner')


    function resetFetch() {
        Spinner.removeClass('spinner-hide')
        skip = 0
    }

    let prevSelection

    function handleChangeFeatured(image, imageId, imageTitle) {
        $('#submit-button').html(`set ${imageTitle} to be featured`)
        if (prevSelection === undefined) {
            prevSelection = image
        } else {
            prevSelection.parent().removeClass('selected-image')
            prevSelection = image
        }
        console.log(prevSelection)
        image.parent().addClass('selected-image')
        $('#imagId').val(imageId)
        $('#submit-selection').attr('action', '/admin/set-featured-image?_method=PUT')
    }

    $('.home-image-change').click(function () {
        resetFetch()
        fetchImages(`/admin/photos/fetch?skip=${skip}`, handleChangeFeatured)
    })

    function fetchImages(link, handleId) {
        if (skip === 0) {
            prevButton.addClass('spinner-hide')
        }
        imageContainer.html(' ')
        $.get(link, function (data) {
            Spinner.addClass('spinner-hide')
            if (data.length < 9) {
                nextButton.addClass('spinner-hide')
            } else {
                nextButton.removeClass('spinner-hide')
            }
            data.forEach(image => {
                imageContainer.append(`<div class='el-card-item collection-item'><i style='display:none;' class='fa fa-check photo-check'></i><div class='el-card-avatar el-overlay-1'><a class='select-image' data-id='${image._id}' data-title='${image.title}'><img src='https://res.cloudinary.com/adgallerytz/image/upload/c_scale,w_300/c_crop,h_200,w_200/v1530026840/photos/${image.image.name}' alt='${image.title}'></a ></div ><div class='el-card-content collection-image-content'> <h4 class='box-title'>${image.image.name}</h4> <small> category : <strong>${image.category.name} <strong></small> <br> </div></div>`)
            })
            const images = $('.select-image')
            images.click(function () {
                handleId($(this), $(this).attr('data-id'), $(this).attr('data-title'))
            })
        })
    }

    //nextbutton function
    nextButton.click(function () {
        Spinner.removeClass('spinner-hide')
        skip = skip + 10
        prevButton.removeClass('spinner-hide')
        fetchImages(`/admin/photos/fetch?skip=${skip}`, handleChangeFeatured)
    })

    //previous button function
    prevButton.click(function () {
        Spinner.removeClass('spinner-hide')
        skip = skip - 10
        fetchImages(`/admin/photos/fetch?skip=${skip}`, handleChangeFeatured)
    })

})
