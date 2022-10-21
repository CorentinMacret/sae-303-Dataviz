var svg = d3.select("svg"),
  margin = 200,
  width = svg.attr("width") - margin,
  height = svg.attr("height") - margin;

svg
  .append("text")
  .attr("transform", "translate(100,0)")
  .attr("x", 220)
  .attr("y", 80)
  .attr("font-size", "20px")
  .text("Nombre de station par arrondissement");

var xScale = d3.scaleBand().range([0, width]).padding(0.5),
  yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g").attr("transform", "translate(" + 90 + "," + 100 + ")");

d3.csv("bar-data.csv").then(function (data) {
  xScale.domain(
    data.map(function (d) {
      return d.date;
    })
  );
  yScale.domain([
    0,
    300
  ]);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("y", height - 140)
    .attr("x", width - 400)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("font-size", "15px")
    .text("arrondissement");

  g.append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -90)
    .attr("y", 25)
    .attr("dy", "-5.1em")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("font-size", "15px")
    .text("nombre de station");

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return xScale(d.date);
    })
    .attr("y", function (d) {
      return yScale(d.value);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return height - yScale(d.value);
    });
}); 
