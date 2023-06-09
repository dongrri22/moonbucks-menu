/* step 2 - DOM 조작과 이벤트 핸들링으로 메뉴 관리하기
// 오늘 얻은 인사이트

// TODO: localStorage Read & Write
// [x] localStorage에 데이터를 저장한다.
// - [x] 메뉴를 추가할 때
// - [x] 메뉴를 변경할 때
// - [x] 메뉴를 삭제할 때
// [x] localStorage의 데이터를 읽어온다.

// TODO: 카테고리별 메뉴판 관리
// [x] 에스프레소 메뉴판 관리
// [x] 프라푸치노 메뉴판 관리
// [x] 블렌디드 메뉴판 관리
// [x] 디저트 메뉴판 관리

// TODO: 페이지 접근시 최초 데이터 Read & Write
// [x] 페이지가 최초로 로딩될 때 localStorage의 에스프레소 메뉴를 읽어온다
// [x] 에스프레소 메뉴를 페이지에 그려준다.

// TODO: 품절 상태 관리
// [x] 품절 버튼을 추가한다.
// [x] 품절 버튼을 클릭하면 localStorage에 상태 값이 저장된다.
// [x] 클릭 이벤트에서 가장 가까운 li태그의 class 속성 값에 sold-out을 추가해 상태를 변경한다.
*/

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, idx) => {
        return `<li data-menu-id="${idx}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">${item.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
       </button>
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
      })
      .join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("메뉴 이름을 입력해주세요.");
      return;
    }

    const espressoMenuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴 이름을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };
  const initEventListeners = () => {
    // form 태그의 자동 전송 막아주기
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") return;
      addMenuName();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton = e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();
app.init();

/* step 1 - DOM 조작과 이벤트 핸들링으로 메뉴 관리하기
// 오늘 얻은 인사이트
// 1. 이벤트 위임에 대해 알게되어 좋았다
// 2. DOM 요소를 가져올 때 $표시를 활용해 변수처럼 사용하는 점을 알게되었다
// 3. 반복되는 코드가 생길 때 즉시 변수나 함수를 선언해 코드 리팩토링을 하는 점을 습관화 해야겠다
// 4. 새롭게 알게 된 메서드 innerText, innerHTML, insetAdjacentHtml, closest

// TODO: 메뉴 추가 기능
// [x] 확인 버튼 클릭으로 추가한다.
// [X] 엔터키 입력으로 추가한다.
// [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// [X] 추가되는 메뉴의 아래 마크업은 <ul id="menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// [X] 총 메뉴 갯수를 count하여 상단에 보여준다.
// [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.

// TODO: 메뉴 수정 기능
// [x] 수정 버튼을 눌러 메뉴 이름을 수정할 수 있다.
// [x] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다. (모달)

// TODO: 메뉴 삭제 기능
// [x] 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
// [x] 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다. (모달)
// [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
*/
