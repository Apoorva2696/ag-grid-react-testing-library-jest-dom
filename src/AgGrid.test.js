import { render, screen, waitFor } from '@testing-library/react';
import AgGridExample from './AgGrid';

import {LicenseManager} from "@ag-grid-enterprise/core";
LicenseManager.setLicenseKey("your license key")


const colDefs = [
  { field: 'name', headerName: 'Name' },
  { field: 'age', headerName: 'Age' }
];

const rowData = [
  { name: 'John', age: 30 },
  { name: 'Rob', age: 26 }
];

const gridOptions = {
  pageSize: 2
};

describe('Server driven ag grid', () => {
  let grid = null;

  beforeEach(async () => {
    grid = render(<AgGridExample {...gridOptions} sampleData={rowData} columnDefs={colDefs} />);
    const { queryByTestId } = grid;
    await  waitFor(() => queryByTestId('grid-ready') !== null)
  })

  afterEach(() => {
    const { unmount } = grid;
    unmount();
  })

  it('renders given columns', async () => {
    expect(screen.getAllByRole('columnheader').length).toBe(2)
    
    await waitFor(() => expect(screen.getByText('Name')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Age')).toBeInTheDocument());
  })

  it('renders given rows', async () => {
    await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('30')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Rob')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('26')).toBeInTheDocument());
  })

  it('render rows', () => {
    // will have two data rows and one header rows
    expect(screen.getAllByRole('row').length).toBe(4)
  })

});
