import axios from 'axios';

export function createServerSideDatasource(server) {
    return {
      getRows: async function (params) {
  
        // if using an actual server dtaa source will call get rows again n again on pagination anf filter/sort change
        // and will fetch data for each request
        const {data} = await axios.get(
          'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json'
        );
        
        // no need to call server if you are fetching data from actual server; fake server is just for this example
        const _response = server.getData(data, params.request);
        
          if (_response.success) {
            // rows gets populated and last row is used for showing total pages in pagination by ag grid
            params.successCallback(_response.rows, _response.lastRow);
          } else {
            params.failCallback();
            // in case you want a custom message or element you can provide it in the grid options
            // see : https://www.ag-grid.com/javascript-grid-overlay-component/
            this.gridApi.showNoRowsOverlay();
          }
        
      }
    };
  }


// no need when fetching from actual server
export function createFakeServer(sampleData) {
    return {
      getData: function (data, request) {
        const requestedRows = sampleData ? sampleData:data.slice(request.startRow, request.endRow);
        const lastRow = getLastRowIndex(request, requestedRows);
        return {
          success: true,
          rows: requestedRows,
          lastRow: lastRow,
        };
      },
    };
  }
  
  function getLastRowIndex(request, results) {
    if (!results) return undefined;
    const currentLastRow = request.startRow + results.length;
    return currentLastRow < request.endRow ? currentLastRow : 8618;
  }