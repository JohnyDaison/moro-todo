import { Provider } from 'react-redux';
import store from './store';
import TodoList from './components/TodoList';

function App() {
  return (
    <Provider store={store}>
      <div className="container py-4">
        <h1 className="text-center mb-4">Todo List</h1>
        <TodoList />
      </div>
    </Provider>
  );
}

export default App;