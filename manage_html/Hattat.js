class Hattat{
    static  generateTable(options) {
        const {
            ajaxUrl = '',
            tableId = 'table' + Date.now(),
            cols = {},
            class: className = '',
            render = false,
            rowCallback = false,
        } = options;

        if (ajaxUrl && Object.keys(cols).length > 0) {
            let tableHtml = `<table id="${tableId}" class="table ${className}">`;
            tableHtml += `<thead><tr>`;
            for (const key in cols) {
                tableHtml += `<th data-field="${key}">${cols[key]}</th>`;
            }
            if (rowCallback) {
                tableHtml += `<th data-nosearch="1"></th>`;
            }
            tableHtml += `</tr></thead></table>`;

            const scriptHtml = `
      <script>
        document.addEventListener('DOMContentLoaded', createDatatable${tableId}, false);
        var filter_params${tableId} = {};
        var ajaxRequest${tableId} = null;
        function createDatatable${tableId}() {
          var dt_filter_table${tableId} = $('#${tableId}');
          if (dt_filter_table${tableId}.length) {
            $('#${tableId} thead tr').clone(true).appendTo('#${tableId} thead');
            $('#${tableId} thead tr:eq(1) th').each(function (i) {
              if($(this).data('nosearch')) return;
              var title = $(this).text();
              $(this).html('<input type="text" data-field="' + $(this).data('field') + '" class="form-control" placeholder="Search ' + title + '" />');
              $('input', this).on('keyup', function () {
                filter_params${tableId}[$(this).data('field')] = this.value;
                dt_filter${tableId}.column(i).search(this.value).draw();
              });
            });
            var dt_filter${tableId} = dt_filter_table${tableId}.DataTable({
              ajax: {
                url: '${ajaxUrl}',
                data: function(d) {
                  delete d.columns;
                  return { filter: filter_params${tableId}, offset: d.start, limit: d.length } ;
                },
                type: "GET",
                headers: {
                  "Authorization": "Bearer " + getCookie('bulutToken')
                },
                beforeSend: function (xhr) {
                  if (ajaxRequest${tableId}) {
                    ajaxRequest${tableId}.abort();
                    //console.log("önceki iptal oldu");
                  }
                  ajaxRequest${tableId} = xhr;
                },
                complete: function () {
                  ajaxRequest${tableId} = null;
                }
              },
              processing: true,
              serverSide: true,
              columns: [
                ${Object.keys(cols)
                .map(
                    (key) =>
                        `{ data: '${key}' ${
                            render
                                ? `, render: function(data, type, row){ return ${render}('${key}', data, type, row) }`
                                : ''
                        } }`
                )
                .join(',')}
                ${rowCallback ? `,{ data: null, title: "İşlem", orderable: false },` : ''}
              ],
              ${
                rowCallback
                    ? `rowCallback: function(row, data, index) { row = ${rowCallback}(row, data, index); },`
                    : ''
            }
              orderCellsTop: true,
              dom: '<"row"<"col-sm-12 col-md-6"l>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
              drawCallback: function() {
                // AJAX ile gelen ikonları işle
              }
            });
          }
        }
      </script>`;
            return tableHtml + scriptHtml;
        }
        return '<!-- table not created -->';
    }
    static uploadFile(options) {
        const {
            id = 'file' + Date.now(),
            name = 'file',
            accept = '',
            multiple = false,
            class: className = '',
            label = 'Dosya Seç',
        } = options;
        return `
      <div class="custom-file">
        <input type="file" class="custom-file-input ${className}" id="${id}" name="${name}" accept="${accept}" ${
            multiple ? 'multiple' : ''
        }>
        <label class="custom-file-label" for="${id}">${label}</label>
      </div>
    `;
    }
}
module.exports = Hattat;