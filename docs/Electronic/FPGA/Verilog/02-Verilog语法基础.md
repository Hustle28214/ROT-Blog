
## 1. 格式

首先，要说明Verilog区分大小写。你可以在一行里写完，也可以跨多行来写。但是用一行来写并不明智，因为你的同事并不一定能快速读懂你的代码甚至来问你。

```Verilog
wire [2:0] output_signal;
assign output_signal = (x == 1'b1) ? 3'b100 :
                      (y == 1'b1) ? 3'b010 :
                      3'b001;
```


你注意到了：跟C语言一样，Verilog里使用分号来结束语句。


## 2. 注释

你可以用``//``进行单行注释，也可以用``/* */``进行跨行注释。

```Verilog
reg [4:0] counter ; // counter is a 5-bit register
/*
wire [2:0] output_signal;
assign output_signal = (x == 1'b1) ? 3'b100 :
*/
```

## 3. 标识符&关键字

你可以使用任何字母、数字、下划线和美元符$来命名标识符。但是，<mark>不能以数字和美元符开头</mark>。标识符区分大小写。

你不能使用关键字作为标识符，这篇文章告诉你哪些是关键字：

[Verilog标识符与关键字 ](https://juejin.cn/post/6992086449608720398)

Verilog 中关键字全部为小写。

```Verilog

reg [4:0] counter ; // reg is a keyword, counter is an identifier

```

## 4. 数值表示方法

你可以使用十进制、二进制、八进制和十六进制来表示数值。

十进制('d 或 'D)，十六进制('h 或 'H)，二进制（'b 或 'B），八进制（'o 或 'O）。指明位宽是任意的。

```Verilog
reg [4:0] counter = 5'd10;
reg [4:0] counter = 5'hA;
counter = 'b101; // 一般根据编译器自动分频位宽，常为32bit
```

其中，四种基本的值表示电平逻辑：

1. 逻辑零：0'b0 或 0'h0 或 0'd0
2. 逻辑一：1'b1 或 1'h1 或 1'd1
3. 逻辑高 impedance：1'bz 或 1'hz 或 1'dz
4. 逻辑 don't care：1'bx 或 1'hx 或 1'dx

逻辑零表示逻辑低电平，逻辑一表示逻辑高电平。逻辑高 impedance 表示逻辑高阻抗，逻辑 don't care 表示逻辑不确定。
