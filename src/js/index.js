// 오늘 얻은 인사이트
// 1. 이벤트 위임에 대해 알게되어 좋았다
// 2. DOM 요소를 가져올 때 $표시를 활용해 변수처럼 사용하는 점을 알게되었다
// 3. 반복되는 코드가 생길 때 즉시 변수나 함수를 선언해 코드 리팩토링을 하는 점을 습관화 해야겠다
// 4. 새롭게 알게 된 메서드 innerText, innerHTML, insetAdjacentHtml, closest

// step 1 - DOM 조작과 이벤트 핸들링으로 메뉴 관리하기
// TODO: 메뉴 추가 기능
// [x] 확인 버튼 클릭으로 추가한다.
// [X] 엔터키 입력으로 추가한다.
// [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// [X] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// [X] 총 메뉴 갯수를 count하여 상단에 보여준다.
// [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.

// TODO: 메뉴 수정 기능
// [x] 수정 버튼을 눌러 메뉴 이름을 수정할 수 있다.
// [x] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다. (모달)

// TODO: 메뉴 삭제 기능
// [x] 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
// [x] 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다. (모달)
// [x] 총 메뉴 갯수를 count하여 상단에 보여준다.

const $ = (selector) => document.querySelector(selector);

function App() {
  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("메뉴 이름을 입력해주세요.");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
    };
    $("#espresso-menu-list").insertAdjacentHTML("beforeend", menuItemTemplate(espressoMenuName));
    $("#espresso-menu-name").value = "";
    updateMenuCount();
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴 이름을 수정하세요", $menuName.innerText);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  // form 태그의 자동 전송 막아주기
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;
    addMenuName();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });
}

App();
