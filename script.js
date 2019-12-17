var modify = false



$(function () {

    $('#modify').click(function(){
        $('.test').show();
        $("#sortable").sortable();
        $("#sortable").disableSelection();
        if(modify == false){
            $("#sortable").sortable();
            $( "#sortable" ).sortable( "option", "disabled", false ); //다시 바꿀수 있게 하기 위한 코드
            $("#sortable").disableSelection();
            $('#modify').html('완료');
            modify = true;
        }else{
            modify = false;
            $( "#sortable" ).sortable("disable");
            $('#modify').html('수정');
        }
    });
        $('.basicButtons2').click(function(){
        $('.test').hide();
    });

});