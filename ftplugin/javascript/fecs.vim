"
" @file fecs plugin
" @author treelite(c.xinle@gmail.com)
"

if exists(':FECS')
    finish
endif

" 获取当前脚本的路径
let s:root = expand('<sfile>:p:h')

function s:check(start, end)
    let cmdline = ['node']
    call add(cmdline, s:root.'/fecs.js')
    let input = getline(a:start, a:end)

    " 结尾补充一个换行符 getline的内容没有换行符
    let res = system(join(cmdline, ' '), join(input, "\n")."\n")

    let lines = split(res, "\n")

    let max = len(lines)
    if max <= 0
        echo 'Everything is OK'
        cclose
        return
    endif

    let qfList = []
    let index = 0
    while index < max
        let item = split(lines[index], ',')
        let index = index + 1
        let o = {}
        let o.bufnr = bufnr('%')
        let o.lnum = str2nr(item[1])
        let o.col = str2nr(item[2])
        let o.text = item[4]
        let o.type = item[0]
        call add(qfList, o)
    endwhile

    echo 'There are '.len(qfList).' errors found!'
    call setqflist(qfList)
    belowright copen

endfunction

" 设置命令适用的范围，默认整个buffer
command -range=% FECS call s:check(<line1>, <line2>)
