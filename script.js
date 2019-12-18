//전역변수
var modify = false; //현재 북마크를 수정할수있는 상태인지 아닌지 판단하는 변수

//입력받은 페이지 이름과 주소를 저장한다. 
var inputAddress = null;
var inputName = null;

//페이지들의 배열 생성
var Pages = new Array();

//페이지 객체 생성자
var Page = function(name, address){
    this.name = name;
    this.address = address;
    //이미지 추가기능 나중에 삽입
    //this.imgsrc = imgsrc;
}


//메인 jquery 함수
$(document).ready(function () {
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
    //제출 버튼 눌렀을 때
    $('#submit').click(function () {
        submitItem();
    });
})

function submitItem() {
    if (!validateItem()) {
        return;
    }
    inputName = $('#nameInput').val();

    var inputPage = new Page(inputName, inputAddress);
    Pages.push(inputPage);
    //console.log(Pages[0]);
    $("#nameInput").hide();
    $("#newPageName").html(inputName);
    //사용자가 http://도 입력한 경우 자동으로 제외해주는 코드 만들기
    $("#newLink").prop("href", "http://"+inputAddress);
    alert("등록되었습니다.");
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



function createBox() {
    var contents = 
        "<div class='pages'>"
        + "<a href='#' id = 'newLink' target='_blank'>"
        + "<img src = 'images/icon.png' class = 'pageicons'>"
        + "<p id = 'newPageName'>"
        + "</p>"
        + "</a>"
        + "<input type='text' id = 'nameInput' name='item' style='width:80px;'/>"
        + "</div>";
    return contents;
}

function createItem() {
    inputAddress = prompt("추가할 웹페이지의 주소를 입력하세요.");
    $(createBox())
        .appendTo("#pageBoxWrap")
        .hover(
            function () {
                $(this).css('backgroundColor', '#f9f9f5');
                $(this).find('.deleteBox').show();
            },
            function () {
                $(this).css('background', 'none');
                $(this).find('.deleteBox').hide();
            }
        )
        .append("<div class='deleteBox'>[삭제]</div>")
        .find(".deleteBox").click(function () {
            var valueCheck = false;
            $(this).parent().find('input').each(function () {
                if ($(this).attr("name") != "type" && $(this).val() != '') {
                    valueCheck = true;
                }
            });

            //삭제하는 함수
            if (valueCheck) {
                var delCheck = confirm('입력하신 내용이 있습니다.\n삭제하시겠습니까?');
            }
            if (!valueCheck || delCheck == true) {
                $(this).parent().remove();
                reorder();
            }
        });
}

