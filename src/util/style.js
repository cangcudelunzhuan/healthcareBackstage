export let style = `
.print-content .title {
  font-size: 16pt;
  font-weight: bold;
  text-align: center;
}
.datep {
  font-size: 10.5pt;
  text-align: center;
}
.print-item dt {
  border-bottom: 1px solid #ebebeb;
}
.print-item dt h3{
  font-size: 14pt;
  color: #000;
  font-weight: bold;
  margin-top:1cm
}
.print-item dd {
  word-wrap:break-word;
  display:block;
}
.print-item dd.haspadding {
  padding: 24px 44px
}
.fontp {
  font-size: 12pt;
}
.tablebox {
  border: 1px solid #dedede;
  width: 100%;
  margin-left:-44px;
  border-collapse:collapse;border-spacing:0
}
.catable{
  border-collapse:collapse;border-spacing:0
}
.tablebox th, .tablebox td {
  text-align: center;
  font-family:'楷体_GB2312';
  border: 1px solid #dedede;
  padding:0.2cm
}
th, td{
  font-family:'楷体_GB2312';
  font-size: 12pt;
}
.tablebox td.normal {
  font-size: 12pt;
}
.faback th, .faback td{
  background: #fafafa
}
.tNormalFont {
  font-size: 12pt;
  font-weight: bold;
}
.fontdd {
  font-size: 12pt;
  color: #000
}
.fontdd h3, .fontdd h4, .smalltitle{
  font-weight:bold;
  font-size:12pt;
}
.fontItem .ddtitle {
  font-weight: bold;
  margin-right: 10px;
  width:90px
}
.fontItem {
}
.fontddItem-p {
  font-size: 12pt;
  text-indent: 2em
}
.referenceValu {
  font-size: 12pt;
  font-weight: normal;
}
.high {
  font-size: 12pt;
  font-weight: bold;
}
.redfont {
  color: #FA476F
}
.normal i {
  font-size: 10px
}
.print-content {
  position: relative;
}
.fontdd h3.childT {
  margin-top: -5px;
}
.templete {
  font-size:12pt;
  text-indent:2em;
}
@page WordSection1 {
  size: 595.3pt 841.9pt;
  margin: 2.54cm 3.18cm;
  mso-header-margin: 42.55pt;
  mso-footer-margin: 49.6pt;
  mso-paper-source: 0;
  font-family:'楷体_GB2312';
  color: #000;
}
div.WordSection1 {
    page: WordSection1
}`
