'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { AgGridReact } from '@ag-grid-community/react';
import { ColumnsToolPanelModule, ServerSideRowModelModule } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine-dark.css';

export default class GridExample extends Component {
  constructor(props) {
    super(props);

    this.gridOptions = {
      modules: [ServerSideRowModelModule, ColumnsToolPanelModule],
      columnDefs: props.columnDefs ? props.columnDefs :[
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
        },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' }
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 100,
      },
      rowModelType: 'serverSide',
      pagination: true,
      paginationPageSize: props.pageSize? props.pageSize:10
    };
  }

  onGridReady = (params) => {

    //sample data to be used only for testing
    const { sampleData } = this.props;

    /**incase of functional components you can use const gridApi =useRef()
     * and set gridApi.current = params.api in onGridReady  
     */
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const updateData = () => {

      // you can eliminate the fake server when fetching actual data
      const fakeServer = createFakeServer(sampleData);

      //data source is used by ag grid to fetch 
      const datasource = createServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    };

    updateData();
  };

  render() {
    return (
      <div style={{ width: '100%', height: '520px' }}>
        {this.gridApi !== undefined ? <div data-testid={'grid-ready'}/>:null}
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
    getRows: async function (params) {
     
      const {data} = await axios.get(
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json'
      );
      
      // no need to call server if you are fetching data from actual server; fake server is just for this example
      const _response = server.getData(data, params.request);
      
        if (_response) {
          // rows gets populated and last row is used for pagination by ag grid
          params.successCallback(_response.rows, _response.lastRow);
        } else {
          params.failCallback();
          this.gridApi.showNoRowsOverlay();
        }
      
    }
  };
}
function createFakeServer(sampleData) {
  return {
    getData: function (data, request) {
      const requestedRows = sampleData ? sampleData:data.slice(request.startRow, request.endRow);
      const lastRow = getLastRowIndex(request, requestedRows);
      console.log(requestedRows)
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
  return currentLastRow < request.endRow ? currentLastRow : undefined;
}

