import { useEffect, useRef, useState } from "react";
import "./Todos.scss";

enum KEY_BOARD {
  enter = "Enter",
}

interface TodosType {
  value: string;
  isCompleted: boolean;
}

const Todos = () => {
  const [todoList, setTodoList] = useState<TodosType[]>([]);
  const [itemsLeft, setItemsLeft] = useState<number>(0);

  let inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const myTodoList = sessionStorage.getItem("todoList");

    if (myTodoList) {
      const myTodoListParse = JSON.parse(myTodoList);

      if (myTodoListParse.length) {
        setTodoList(JSON.parse(myTodoList));
      }
    }

    if (inputRef) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    handleCountItemsLeft();

    if (todoList.length) {
      sessionStorage.setItem("todoList", JSON.stringify(todoList));
    } else {
      sessionStorage.setItem("todoList", JSON.stringify([]));
    }
  }, [todoList]);

  const verifyInput = (value: string) => {
    if (!value) return false;

    const formatValue = value.trim();

    if (formatValue.length < 2) return false;

    return true;
  };

  const handleEnterInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = inputRef.current?.value;

    if (event.key === KEY_BOARD.enter && currentValue) {
      if (verifyInput(`${currentValue}`)) {
        inputRef.current.value = "";
        setTodoList([...todoList, { value: currentValue, isCompleted: false }]);
      }
    }
  };

  const handleEnterInputEdit = (
    event: React.KeyboardEvent<HTMLInputElement>,
    labelId: string,
    index: number
  ) => {
    const currentValue = event.target as HTMLInputElement;

    if (event.key === KEY_BOARD.enter && currentValue) {
      if (verifyInput(`${currentValue}`)) {
        const labelElement = document.getElementById(labelId);
        const value = currentValue.value;

        if (labelElement) {
          let newTodos: TodosType[] = todoList;
          newTodos[index].value = value;

          labelElement.innerHTML = value;
          currentValue.value = value;

          setTodoList(newTodos);
          sessionStorage.setItem("todoList", JSON.stringify(newTodos));
        }

        currentValue.style.display = "none";
      }
    }
  };

  const handleOnClickComplete = (index: number) => {
    const newTodoList = todoList;

    if (newTodoList[index]) {
      newTodoList[index].isCompleted = !newTodoList[index].isCompleted;

      setTodoList([...newTodoList]);
    }
  };

  const handleDoubleOnClick = (id: string, labelId: string) => {
    if (!id) return;

    const editInputElement = document.getElementById(id) as HTMLInputElement;
    const labelElement = document.getElementById(labelId) as HTMLInputElement;

    if (editInputElement) {
      editInputElement.style.display = "block";
      editInputElement.focus();
      editInputElement.click();
    }
    if (labelElement) {
      editInputElement.value = labelElement.innerHTML;
    }
  };

  const handleOnBlur = (id: string) => {
    if (!id) return;

    const element = document.getElementById(id) as HTMLInputElement;

    if (element) {
      element.style.display = "none";
    }
  };

  const handleRemove = (index: number) => {
    const newTodos = [...todoList];
    newTodos.splice(index, 1);

    setTodoList(newTodos);
  };

  const handleCountItemsLeft = () => {
    const listTodosActive = todoList.filter(
      (todoItem: TodosType) => !todoItem.isCompleted
    );

    if (listTodosActive && !!listTodosActive.length) {
      setItemsLeft(listTodosActive.length);
      return;
    }

    setItemsLeft(0);
  };

  const handleAllFilter = () => {
    const todosList = document.querySelectorAll(".todos__list-todos-item");

    if (todosList && todosList.length) {
      todosList.forEach((element) => {
        element.classList.remove("todos__hidden");
      });
    }
  };

  const handleActiveFilter = () => {
    const avtiveList = document.querySelectorAll(
      ".todos__list-todos-item:not(.todos__list-todos-item-completed)"
    );
    const completedList = document.querySelectorAll(
      ".todos__list-todos-item.todos__list-todos-item-completed"
    );

    if (avtiveList && avtiveList.length) {
      avtiveList.forEach((element) =>
        element.classList.remove("todos__hidden")
      );
    }
    if (completedList && completedList.length) {
      completedList.forEach((element) =>
        element.classList.add("todos__hidden")
      );
    }
  };

  const handleCompletedFilter = () => {
    const avtiveList = document.querySelectorAll(
      ".todos__list-todos-item:not(.todos__list-todos-item-completed)"
    );
    const completedList = document.querySelectorAll(
      ".todos__list-todos-item.todos__list-todos-item-completed"
    );

    if (completedList && completedList.length) {
      completedList.forEach((element) =>
        element.classList.remove("todos__hidden")
      );
    }
    if (avtiveList && avtiveList.length) {
      avtiveList.forEach((element) => element.classList.add("todos__hidden"));
    }
  };

  const handleSelectFilter = (id: string) => {
    const filterItems = document.querySelectorAll(".filterItem");
    filterItems.forEach((item) => item.classList.remove("selected"));

    const activeFilter = document.getElementById(id);
    activeFilter?.classList.add("selected");
  };

  const handleCompleteAll = (e: React.MouseEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    let newListTodo = [];

    if (isChecked) {
      newListTodo = todoList.map((value: TodosType) => ({
        ...value,
        isCompleted: true,
      }));
    } else {
      newListTodo = todoList.map((value: TodosType) => ({
        ...value,
        isCompleted: false,
      }));
    }

    setTodoList(newListTodo);
  };

  const handleClearCompleted = () => {
    const newTodoList = todoList.filter(
      (value: TodosType) => !value.isCompleted
    );

    if (newTodoList && newTodoList?.length) {
      setTodoList(newTodoList);
    } else {
      setTodoList([]);
    }
  };

  return (
    <div className={"todos"}>
      <div className={"todos__wrapper"}>
        <div className={"todos__container"}>
          <h1 className="todos__title">todos</h1>
          <div className="todos__input-container">
            {todoList && !!todoList.length && (
              <div className="todos__select-all-container">
                <input
                  className="select-all todos__select-all-checkbox"
                  id="select-all"
                  type="checkbox"
                  onClick={handleCompleteAll}
                ></input>
                <label
                  id="label-selectAll"
                  className="todos__select-all-label"
                  htmlFor="select-all"
                ></label>
              </div>
            )}

            <input
              className={"todos__input"}
              placeholder="What needs to be done?"
              type="text"
              ref={inputRef}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                handleEnterInput(event)
              }
            ></input>
          </div>
          {todoList && !!todoList.length && (
            <div className={"todos__list-todos"}>
              <div className={"todos__list-todos-conainer"}>
                {todoList.map((todoData: TodosType, index: number) => {
                  const { value, isCompleted } = todoData;
                  const itemId = `${value}-${index}`;
                  const labelId = `label-${value}-${index}`;
                  const editInputId = `edit-${value}-${index}`;

                  return (
                    <div
                      id={itemId}
                      key={itemId}
                      className={`todos__list-todos-item ${
                        isCompleted ? "todos__list-todos-item-completed" : ""
                      }`}
                    >
                      <input
                        id={editInputId}
                        className={"todos__input-edit"}
                        type="text"
                        onKeyDown={(
                          event: React.KeyboardEvent<HTMLInputElement>
                        ) => handleEnterInputEdit(event, labelId, index)}
                        onBlur={() => {
                          handleOnBlur(editInputId);
                        }}
                      ></input>
                      <input
                        className={"todos__list-todos-checkbox"}
                        onClick={() => handleOnClickComplete(index)}
                        type="checkbox"
                      ></input>
                      <div
                        id={labelId}
                        onDoubleClick={() =>
                          handleDoubleOnClick(editInputId, labelId)
                        }
                        className={"todos__list-todos-label"}
                      >
                        {value}
                      </div>
                      <div
                        className={"todos__list-todos-remove"}
                        onClick={() => handleRemove(index)}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {todoList && !!todoList.length && (
            <div className="todos__controler-container">
              <div className="todos__controler-label">
                {itemsLeft}{" "}
                {itemsLeft === 0 || itemsLeft > 1 ? "items" : "item"} left!
              </div>
              <div className="todos__controler-filter">
                <a
                  id="filterAll"
                  className="filterItem selected"
                  href="#all"
                  onClick={() => {
                    handleAllFilter();
                    handleSelectFilter("filterAll");
                  }}
                >
                  All
                </a>
                <a
                  id="filterActive"
                  className="filterItem"
                  href="#active"
                  onClick={() => {
                    handleActiveFilter();
                    handleSelectFilter("filterActive");
                  }}
                >
                  Active
                </a>
                <a
                  id="filterComplete"
                  className="filterItem"
                  href="#completed"
                  onClick={() => {
                    handleCompletedFilter();
                    handleSelectFilter("filterComplete");
                  }}
                >
                  Completed
                </a>
              </div>
              <div
                className="todos__controler-clear"
                onClick={() => handleClearCompleted()}
              >
                Clear completed
              </div>
            </div>
          )}
        </div>
        <div className="todos__credit">
          <div>Double-click to edit a todo</div>
          <div>Created by the Man cmn Do</div>
          <div>Part of Elix</div>
        </div>
      </div>
    </div>
  );
};

export default Todos;
