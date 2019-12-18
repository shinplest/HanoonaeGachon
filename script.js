var modify = false


//페이지를 저장하는 객체 생성자
var Page = function(name, address){
    this.name = name;
    this.address = address;
    //이미지 추가기능 나중에 삽입
    //this.imgsrc = imgsrc;
}

$(document).ready(function () {
    $('#modify').click(function () {
        $('.test').show();
        $("#pageBoxWrap").sortable();
        $("#pageBoxWrap").disableSelection();
        if (modify == false) {
            $("#pageBoxWrap").sortable();
            $("#pageBoxWrap").sortable("option", "disabled", false); //다시 바꿀수 있게 하기 위한 코드
            $("#pageBoxWrap").disableSelection();
            $('#modify').html('완료');
            modify = true;

            //이동할수 있는 것을 표현해 주기 위한 애니메이션 코드
        } else {
            modify = false;
            $("#pageBoxWrap").sortable("disable");
            $('#modify').html('수정');
        }
    });
    //추가 기능 눌렀을때
    $('#add').click(function () {
        createItem();
    });
    $('#submit').click(function () {
        submitItem();
    });
})

function submitItem() {
    if (!validateItem()) {
        return;
    }
    alert("등록되었습니다.");
    $('.address').hide();
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
    var contents = "<div class='pages'>"
        + "<img src = 'images/icon.png' class = 'pageicons'>"
        + "<input type='text' name='item' style='width:100px;'/>"
        + "</div>";
    return contents;
}

function createItem() {
    var name;
    var address = prompt("추가할 웹페이지의 주소를 입력하세요.");
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

            if (valueCheck) {
                var delCheck = confirm('입력하신 내용이 있습니다.\n삭제하시겠습니까?');
            }
            if (!valueCheck || delCheck == true) {
                $(this).parent().remove();
                reorder();
            }
        });
}

