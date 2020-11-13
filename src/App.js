'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { AgGridReact } from '@ag-grid-community/react';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine-dark.css';

export default class GridExample extends Component {
  constructor(props) {
    super(props);

    this.gridOptions = {
      modules: [ServerSideRowModelModule],
      columnDefs: [
        {
          field: 'athlete',
          minWidth: 220,
        },
        {
          field: 'country',
          minWidth: 200,
        },
        { field: 'year' },
        {
          field: 'sport',
          minWidth: 200,
        }
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 100,
      },
      rowModelType: 'serverSide',
    };
  }

  onGridReady = (params) => {

    /**incase of functional components you can use const gridApi =useRef()
     * and set gridApi.current = params.api in onGridReady  
     */
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const updateData = () => {

      // you can eliminate the fake server when fetching actual data
      var fakeServer = createFakeServer();
      var datasource = createServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    };

    updateData()

  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          id="myGrid"
          style={{
            height: '100%',
            width: '100%',
          }}
          className="ag-theme-alpine-dark"
        >
          <AgGridReact
            {...this.gridOptions}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    );
  }
}

function createServerSideDatasource(server) {
  return {
    getRows: function (params) {
     
      const rawResponse = axios.post(
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json'
      , params.request);

      // no need to call server if you are fetching data from actual server; fake server is just for this example
      var response = server.getData(JSON.parse(rawResponse), params.request);
      
        if (response.success) {
          // rows gets populated and last row is used for pagination by ag grid
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      
    }
  };
}
function createFakeServer(allData) {
  return {
    getData: function (request) {
      var requestedRows = allData.slice(request.startRow, request.endRow);
      var lastRow = getLastRowIndex(request, requestedRows);
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
  var currentLastRow = request.startRow + results.length;
  return currentLastRow < request.endRow ? currentLastRow : undefined;
}

render(<GridExample></GridExample>, document.querySelector('#root'));
