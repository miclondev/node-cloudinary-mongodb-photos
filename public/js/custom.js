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
    photoId.on('change', function () {
        if (this.checked) {
            selected.push(this.value)
            togglemulti.html(`<span>(${selected.length})</span> selected`)
            console.log(selected)
        } else {
            const val = selected.indexOf(this.value)
            selected.splice(val, 1)
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

    deleteForm.submit(function(e){
        e.preventDefault()
        $.post('/admin/multi/delete', { ids: selected }, function (data) {
            if (data === 'successful') {
                location.reload()
            } else {
                alert('could not delete')
            }
        })
    })

})
