
import React, { Component } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ColumnsToolPanelModule, ServerSideRowModelModule } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine-dark.css';
import { createFakeServer, createServerSideDatasource } from './dataSource';
import './AgGrid.css';

// server side row model is available only in enterprise version
import {LicenseManager} from "@ag-grid-enterprise/core";
LicenseManager.setLicenseKey("your license key")

export default class AgGridExample extends Component {
  constructor(props) {
    super(props);

    this.state={
      gridApi: null,
      columnApi: null
    }

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
      rowClassRules: {
        'rag-green': 'node.gold > 5',
        'rag-amber': 'node.gold <= 5 && node.gold <= 3',
        'rag-red': 'node.gold < 3'
      },
      rowModelType: 'serverSide',
      pagination: true,
      paginationPageSize: props.pageSize? props.pageSize:1000,
      /**cache block size defines the range of start and end row in ag grid
      * this specifies how many rows are to be received by ag grid in each request for pagination
      *  for example if we are requesting for or receiving 10 rows then cacheBlockSize: 10 would make server side
      * grid make its startRow and endRow to 0 and 10 respectively in 1st page, 11 to 20 in 2nd page request and so on
      */
      cacheBlockSize: props.pageSize? props.pageSize:1000
      
    };
  }

  onGridReady =  (params) => {

    //sample data to be used only for testing
    const { sampleData } = this.props;

    // you can eliminate the fake server when fetching actual data
    const fakeServer = createFakeServer(sampleData);

    //data source is used by ag grid to fetch 
    const datasource = createServerSideDatasource(fakeServer);
    
    params.api.setServerSideDatasource(datasource);
    
    /**incase of functional components you can use useState hook 
     * *******************************************************
     * incase of using ref for setting up the apis like: gridApi.current = params.api
     * or in case of functional components you can use const gridApi =useRef() and set gridApi.current = params.api in onGridReady
     * you need to change the testing method to check for availability of grid api rather than checking for grid ready as used in this example
     */
    this.setState({gridApi: params.api, columnApi: params.columnApi})
  };

  render() {
    return (
      <div style={{ width: '100%', height: '90vh', marginTop: '5vh' }}>
        {/*div to test grid ready */}
        {this.state.gridApi !== undefined ? <div data-testid={'grid-ready'}/>:null}
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

