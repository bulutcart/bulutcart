function productRender(field, data, type, row){
    if(field=='image'){
        return '<img class="d-block flex-shrink-0 rounded-circle me-sm-3 me-2" src="' + data + '" alt="Resim" width="50" height="50">';
    }
    if(field=='id'){
        return '<small class="text-muted fw-light">' + data + '</small>';
    }
    if(field=='category'){
        return '<small class="text-muted fw-light">' + data + '</small>';
    }
    if(field=='name'){
        var html = '<div class="d-flex align-items-center"><img class="d-block flex-shrink-0 me-sm-3 me-2" src="' + row.image + '" alt="Resim" width="50" height="50">';
        html += '<a href="/product/edit/' + row['id'] + '" target="_blank" >' + data + '</a></div>';
        for (var variant_type in row.variants) {
            html += '<div><div class="text-light small fw-medium">' + variant_type + '</div>';
            var variants = row.variants[variant_type];
            html += '<div class="inline">';
            for (var variant_value in variants) {
                var variant = variants[variant_value];
                if(variant['quantity']>0){
                    html += '<span class="badge bg-label-success me-1 mb-1">' + variant_value + '</span>';
                } else {
                    html += '<span class="badge bg-label-danger me-1 mb-1">' + variant_value + '</span>';
                }

            }
            html += '</div>';
        }
        html += '</div>';
        return html;
    }
    return data;
}
function productRowCallback(row, data, index) {
    $('td:last', row).html(`<div class="d-flex align-items-center dtr-hidden float-end"><a href="/product/edit/${data.id}" class="btn btn-icon item-edit"><i class="menu-icon tf-icons ti ti-edit"></i></a><div class="d-inline-block"><a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti ti-dots-vertical ti-sm text-muted"></i></a><ul class="dropdown-menu dropdown-menu-end m-0" style=""><li><a href="javascript:;" class="dropdown-item">Details</a></li><li><a href="javascript:;" class="dropdown-item">Archive</a></li><div class="dropdown-divider"></div><li><a href="javascript:;" class="dropdown-item text-danger delete-record">Delete</a></li></ul></div></div>`);
    return row;
}
function brandRender(field, data, type, row){

    if(field=='name'){
        var html = '<div class="d-flex align-items-center"><img class="d-block flex-shrink-0 me-sm-3 me-2" src="' + row.image + '" width="32">' + data ;
        html += '</div>';
        return html;
    }
    return data;
}
function brandRowCallback(row, data, index) {
    $('td:last', row).html(`<div class="d-flex align-items-center dtr-hidden float-end"><a href="/brand/edit/${data.id}" class="btn btn-icon item-edit"><i class="menu-icon tf-icons ti ti-edit"></i></a><div class="d-inline-block"><a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti ti-dots-vertical ti-sm text-muted"></i></a><ul class="dropdown-menu dropdown-menu-end m-0" style=""><li><a href="javascript:;" class="dropdown-item">Details</a></li><li><a href="javascript:;" class="dropdown-item">Archive</a></li><div class="dropdown-divider"></div><li><a href="javascript:;" class="dropdown-item text-danger delete-record">Delete</a></li></ul></div></div>`);
    return row;
}
function categoryRender(field, data, type, row){

    if(field=='name'){
        data = row['name'] + ' <small class="text-muted text-danger">' + row['path'] + '</small>';
    }
    return data;
}
function categoryRowCallback(row, data, index) {
    $('td:last', row).html(`<div class="d-flex align-items-center dtr-hidden float-end"><a href="/category/edit/${data.id}" class="btn btn-icon item-edit"><i class="menu-icon tf-icons ti ti-edit"></i></a><div class="d-inline-block"><a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti ti-dots-vertical ti-sm text-muted"></i></a><ul class="dropdown-menu dropdown-menu-end m-0" style=""><li><a href="javascript:;" class="dropdown-item">Details</a></li><li><a href="javascript:;" class="dropdown-item">Archive</a></li><div class="dropdown-divider"></div><li><a href="javascript:;" class="dropdown-item text-danger delete-record">Delete</a></li></ul></div></div>`);
    return row;
}
function attributeRender(field, data, type, row){

    if(field=='name'){
        data = row['name'] + ' <small class="text-muted text-danger">' + row['attribute_value_count'] + ' Seçenek</small>';
    }
    return data;
}
function attributeRowCallback(row, data, index) {
    $('td:last', row).html(`<div class="d-flex align-items-center dtr-hidden float-end"><a href="/attribute/edit/${data.id}" class="btn btn-icon item-edit"><i class="menu-icon tf-icons ti ti-edit"></i></a><div class="d-inline-block"><a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti ti-dots-vertical ti-sm text-muted"></i></a><ul class="dropdown-menu dropdown-menu-end m-0" style=""><li><a href="javascript:;" class="dropdown-item">Details</a></li><li><a href="javascript:;" class="dropdown-item">Archive</a></li><div class="dropdown-divider"></div><li><a href="javascript:;" class="dropdown-item text-danger delete-record">Delete</a></li></ul></div></div>`);
    return row;
}