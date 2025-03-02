
function sellerRender(field, data, type, row){
    if(field=='name'){
        if(!row.image) row.image = 'assets/img/front-pages/icons/user.png';
        var html = '<div class="d-flex align-items-center"><img class="d-block flex-shrink-0 me-sm-3 me-2" src="' + row.image + '" alt="Resim" width="32" height="32">' + row.name + '</div>';
        return html;
    }
    if(field=='status'){
        if(data==1){
            return '<span class="badge bg-label-success">Aktif</span>';
        } else {
            return '<span class="badge bg-label-danger">Pasif</span>';
        }
    }
    if(field=='store_name'){
        return '<span class="badge text-muted">' + data + '</span>';
    }
    return data;
}
function sellerRowCallback(row, data, index) {
    $('td:last', row).html(`<div class="d-flex align-items-center dtr-hidden float-end"><a href="/seller/edit/${data.id}" class="btn btn-icon item-edit"><i class="menu-icon tf-icons ti ti-edit"></i></a><div class="d-inline-block"><a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti ti-dots-vertical ti-sm text-muted"></i></a><ul class="dropdown-menu dropdown-menu-end m-0" style=""><li><a href="javascript:;" class="dropdown-item">Details</a></li><li><a href="javascript:;" class="dropdown-item">Archive</a></li><div class="dropdown-divider"></div><li><a href="javascript:;" class="dropdown-item text-danger delete-record">Delete</a></li></ul></div></div>`);
    return row;
}

function customerRender(field, data, type, row){
    if(field=='name'){
        if(!row.image) row.image = 'assets/img/front-pages/icons/user.png';
        var html = '<div class="d-flex align-items-center"><img class="d-block flex-shrink-0 me-sm-3 me-2" src="' + row.image + '" alt="Resim" width="32" height="32">' + row.name + '</div>';
        return html;
    }
    if(field=='status'){
        if(data==1){
            return '<span class="badge bg-label-success">Aktif</span>';
        } else {
            return '<span class="badge bg-label-danger">Pasif</span>';
        }
    }
    if(field=='store_name'){
        return '<span class="badge text-muted">' + data + '</span>';
    }
    return data;
}
function customerRowCallback(row, data, index) {
    $('td:last', row).html(`<div class="d-flex align-items-center dtr-hidden float-end"><a href="/customer/edit/${data.id}" class="btn btn-icon item-edit"><i class="menu-icon tf-icons ti ti-edit"></i></a><div class="d-inline-block"><a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti ti-dots-vertical ti-sm text-muted"></i></a><ul class="dropdown-menu dropdown-menu-end m-0" style=""><li><a href="javascript:;" class="dropdown-item">Details</a></li><li><a href="javascript:;" class="dropdown-item">Archive</a></li><div class="dropdown-divider"></div><li><a href="javascript:;" class="dropdown-item text-danger delete-record">Delete</a></li></ul></div></div>`);
    return row;
}
function managerRender(field, data, type, row){
    if(field=='name'){
        if(!row.image) row.image = 'assets/img/front-pages/icons/user.png';
        var html = '<div class="d-flex align-items-center"><img class="d-block flex-shrink-0 me-sm-3 me-2" src="' + row.image + '" alt="Resim" width="32" height="32">' + row.name + '</div>';
        return html;
    }
    if(field=='status'){
        if(data==1){
            return '<span class="badge bg-label-success">Aktif</span>';
        } else {
            return '<span class="badge bg-label-danger">Pasif</span>';
        }
    }
    if(field=='store_name'){
        return '<span class="badge text-muted">' + data + '</span>';
    }
    return data;
}
function managerRowCallback(row, data, index) {
    $('td:last', row).html(`<div class="d-flex align-items-center dtr-hidden float-end"><a href="/manager/edit/${data.id}" class="btn btn-icon item-edit"><i class="menu-icon tf-icons ti ti-edit"></i></a><div class="d-inline-block"><a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti ti-dots-vertical ti-sm text-muted"></i></a><ul class="dropdown-menu dropdown-menu-end m-0" style=""><li><a href="javascript:;" class="dropdown-item">Details</a></li><li><a href="javascript:;" class="dropdown-item">Archive</a></li><div class="dropdown-divider"></div><li><a href="javascript:;" class="dropdown-item text-danger delete-record">Delete</a></li></ul></div></div>`);
    return row;
}
