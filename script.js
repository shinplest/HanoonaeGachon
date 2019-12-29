//control k + f 코드 자동정렬


//전역변수
var modify = false; //현재 북마크를 수정할수있는 상태인지 아닌지 판단하는 변수
var del = false; //현재 북마크를 삭제하고 있는 상태인지 아닌지 판단하는 변수
var basePages = 0; //기본 페이지 개수
var gachonPages = [
    ["가천대학교", "http://www.gachon.ac.kr/", "images/icon.png"],
    ["공지사항", "http://www.gachon.ac.kr/community/opencampus/03.jsp?boardType_seq=358", "images/icon.png"],
    ["사이버 캠퍼스", "http://cyber.gachon.ac.kr/", "images/icon.png"],
    ["Wind", "https://wind.gachon.ac.kr/", "https://wind.gachon.ac.kr/attachment/view/134/favicon.ico"],
    ["도서관", "https://lib.gachon.ac.kr/", "images/icon.png"],
    ["리버럴 아츠 컬리지", "http://glac.gachon.ac.kr/", "images/icon.png"],
    ["국제교류처", "http://oia.gachon.ac.kr", "images/icon.png"],
    ["가천대학교 취업진로처", "https://work.gachon.ac.kr/", "https://work.gachon.ac.kr/attachment/view/4892/favicon.ico"],
    ["한국 장학 재단", "http://www.kosaf.go.kr/", "images/icons/janghak.png"],
    ["나이테", "https://naete.gachon.ac.kr", "https://naete.gachon.ac.kr/attachment/view/105/favicon.ico"],
    ["vms", "https://www.vms.or.kr/", "https://www.vms.or.kr/favicon.ico"],
    ["1365 자원봉사 포털", "https://www.1365.go.kr/", "https://www.1365.go.kr/web/vols/images/ico/favicon.ico"],
    ["가천대 에브리타임", "https://gachon.everytime.kr/", "https://gachon.everytime.kr/favicon.ico"],
    ["가천대에 좋아하는 사람이 있다면", "https://www.facebook.com/lovegachon/", "https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico"],
    ["가천대 대나무 숲", "https://www.facebook.com/gcubamboo/", "https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico"]
];

//입력받은 페이지 이름과 주소를 저장한다. 
var inputAddress = "https://www.gachon.ac.kr/main.jsp";
var inputName = null;

//페이지 객체 생성자
var Page = function (name, address, imgUrl) {
    this.name = name;
    this.address = address;
    this.imgUrl = imgUrl;
}


//메인 jquery 함수
$(document).ready(function () {
    Pages = [];

    //로컬저장소가 비어있을 경우 
    //최초 실행시 한번만 가천배열을 어펜드 해줌. 
    if (localStorage.getItem("Pages") == null) {
        appendGachonPages();
    }
    //아닐 경우 전부 읽어와서 페이지에 저장
    else {
        Pages = JSON.parse(localStorage.getItem("Pages"));
    }
    //현재 배열을 제대로 읽어오는지 확인하는 코드
    console.log(Pages);
    //읽어온 페이지 길이만큼 읽어주면서 하나씩 만들어서 어펜드. 
    appendPages();
    //읽어온 페이지에 대체 그림 넣어줌
    replaceImage();

    $('#modify').click(function () {

        //수정이 불가능한 상태에서 수정을 클릭한경우, 드래그 앤 드랍으로 정렬 순서를 바꿀 수 있게 한다.
        if (modify == false) {
            $("#pageBoxWrap").sortable();
            $("#pageBoxWrap").sortable("option", "disabled", false); //다시 바꿀수 있게 하기 위한 코드
            $("#pageBoxWrap").disableSelection();
            $('#modify').html('완료');
            modify = true;
            //이동할수 있는 것을 표현해 주기 위한 애니메이션 코드 추가 예정
            //수정을 완료하면 다시 드래그 앤 드랍 기능을 꺼줌    
        } else {
            modify = false;
            $("#pageBoxWrap").sortable("disable");
            $('#modify').html('수정');
        }
    });

    //추가 버튼 눌렀을 때
    $('#add').click(function () {
        createItem();
    });
    $('#delete').click(function () {
        deletePage();
    });
    $('#factoryReset').click(function () {
        factoryReset();
    });
})


//페이지 아이콘 박스 생성
function createBox(imgaddress) {
    var contents =
        "<div class = 'pages'>"
        + "<a href='#' target='_blank' class = 'pagesLink'>"
        + "<div class = 'pageWrap'>"
        + "<img src = '"
        + imgaddress
        + "'class = 'pageicons'>"
        + "<p>"
        + "</p>"
        + "</div>"
        + "</a>"
        + "<div>";

    return contents;
}
//추가했을 경우 실행되는 함수 
function createItem() {
    getTabData(function (tabdata) {

        //현재 웹페이지 주소를 디폴트로 가져옴. 
        inputAddress = prompt("추가할 웹페이지의 주소를 입력하세요.", tabdata.url);
        //https:// 있으면 자동으로 제외해줌. 
        if (inputAddress.indexOf("https://") != -1) {
            inputAddress = inputAddress.replace("https://", "");
        }
        if (inputAddress.indexOf("http://") != -1) {
            inputAddress = inputAddress.replace("http://", "");
        }
        if (inputAddress == null) return;
        inputName = prompt("추가할 페이지의 이름은?", tabdata.title);
        inputName = inputName.substr(0, 20);
        if (inputName == null) return;
        console.log(tabdata.favIconUrl);
        $(createBox(tabdata.favIconUrl))
            .appendTo("#pageBoxWrap")
            .find('a').prop("href", "http://" + inputAddress)
            .children().find("p").html(inputName);
        savePagesToLocalStorage();
        alert("등록되었습니다.");
        location.reload();
    });
}
//페이지 삭제 관련함수
function deletePage() {
    if (del == false) {
        $('#delete').html("삭제 완료");
        //클릭 비활성화
        $('.pages').click(function () { return false });
        addAndRemoveDelButton();
        alert("이제 삭제하고 싶은 즐겨찾기를 누르세요. ");
        //삭제 이벤트
        del = true;
    }
    else {
        //클릭 재활성화
        //$('.pages').unbind('click');
        $('#delete').html("삭제");
        del = false;
    }

}
//삭제버튼을 생성하고 지우고 페이지 지우는 이벤트 처리
function addAndRemoveDelButton() {
    //마우스 올릴시 삭제 버튼 추가
    $('.pages').mouseenter(function () {
        var testbutton = "<button class = 'delButton'>삭제</button>";
        $(this).children().css('backgroundColor', '#f9f9f5');
        $(testbutton).appendTo($(this));

        //버튼을 누를시 삭제를 해준다
        $('.delButton').click(function () {
            $(this).parent().remove();
            //삭제 후 변경사항 저장. 
            savePagesToLocalStorage();
            alert("삭제되었습니다.");
        });
    });
    //마우스 나갈시 삭제버튼 제거
    $('.pages').mouseleave(function () {
        $(this).closest("div").css('background', 'none');
        $(this).find('.delButton').remove();
    });
}

//페이지 정보를 로컬스토리지에 저장(삭제하거나 추가, 순서 변경시에 실행됨)
function savePagesToLocalStorage() {
    //모든 pages가져와서 객체로 저장.
    var pages = $(".pages");
    var tempName = null;
    var tempAddress = null;
    var tempImgUrl = null;

    //배열에 현재 페이지 정보 저장
    var Pages = new Array();
    for (var i = 0; i < pages.length; i++) {
        tempName = $(pages[i]).find("p").text();
        tempAddress = $(pages[i]).find("a").attr("href");
        tempImgUrl = $(pages[i]).find("img").attr("src");
        var pushPage = new Page(tempName, tempAddress, tempImgUrl);
        Pages.push(pushPage);
    }
    //로컬스토리지 초기화후 페이지 정보 저장 
    localStorage.clear();
    localStorage.setItem("Pages", JSON.stringify(Pages));
}

//페이지 추가 
function appendPages() {
    for (var i = basePages; i < Pages.length; i++) {
        $(createBox())
            .appendTo("#pageBoxWrap")
            //호버 액션 현재 마우스 위치 배경색 바꿔줌
            .hover(
                function () {
                    $(this).children().css('backgroundColor', '#f9f9f5');
                },
                function () {
                    $(this).children().css('background', 'none');
                }
            )
            .find('a').prop("href", Pages[i].address)
            .children().find("img").attr("src", Pages[i].imgUrl)
            .parent().find("p").html(Pages[i].name)
    }
}

//이미지가 없을 경우, 대체 이미지 지정해주는 함수
function replaceImage() {
    var imgs = $('img');
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].onerror = function (e) {
            e.target.src = 'images/icon.png';
        };
    }

}
//초기화 해주는 함수
function factoryReset() {
    var factoryInput = confirm("초기화 하시겠습니까? \n저장한 북마크가 전부 지워집니다.");
    if (factoryInput == true) {
        localStorage.clear();

        //확인을 누를경우만, 페이지 새로고침 
        swal("초기화", "완료되었습니다.", "success")
            .then((value) => {
                location.reload();
            });
    }
}

function appendGachonPages() {
    for (var i = 0; i < gachonPages.length; i++) {
        var pushPage = new Page(gachonPages[i][0], gachonPages[i][1], gachonPages[i][2]);
        Pages.push(pushPage);
        console.log("실행");
    }
}


function getTabData(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0]);
        callback(tabs[0]);
    });
}


function validateItem() {
    var items = $("input[type='text'][name='item']");
    if (items.length == 0) {
        alert("작성된 아이템이 없습니다.");
        return false;
    }

    var flag = true;
    for (var i = 0; i < items.length; i++) {
        if ($(items.get(i)).val().trim() == "") {
            flag = false;
            alert("내용을 입력하지 않은 항목이 있습니다.");
            break;
        }
    }

    return flag;
}

