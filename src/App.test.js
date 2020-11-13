import { render, screen, waitFor } from '@testing-library/react';
import App from './App';


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

  beforeEach( async () => {
    grid = render(<App {...gridOptions} sampleData = {rowData} columnDefs={colDefs}/>);
    const {queryByTestId} = grid;
    await waitFor(() => queryByTestId('grid-ready') !== null)
  })

  afterEach(() => {
    const { unmount } = grid;
    unmount();
  })

  it('renders given columns', () => {
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  })

  // it('renders given rows', () => {
  //   expect(screen.getByText('John')).toBeInTheDocument();
  //   expect(screen.getByText('30')).toBeInTheDocument();
  //   expect(screen.getByText('Rob')).toBeInTheDocument();
  //   expect(screen.getByText('26')).toBeInTheDocument();
  // })

  it('render rows', () => {
    expect(screen.getAllByRole('row').length).toBe(4)
  })

} );
