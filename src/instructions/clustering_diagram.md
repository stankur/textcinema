I need help to create a diagram in the LLM + Algorithms for Natural Language Analytics page.

I want the hexagon that looks similar as the hexagon lattice that has been created for filtering and ordering animations.

Now I want to create the diagram, and title for a new section, clustering. This is actually pretty similar to the ordering animation in some ways.

I want there to be two things.

Thumbnail and Animation.

For the thumbnail, I want and arrangement where the center hexagon (similar to in the filtering diagram) is colored white. And then I want the remaining dots to be divided into three parts, red, green, blue. I want all the colors to be muted, as to not make them too bright because we have a dark background.

The configuration for the rest of the dots in the hexagon is something like this: If you imagine circling/flowing around the center hexagon, you will get a loop. Divide that loop into three segments, each gets red, green, blue, respectively. I don't know how to describe it better, but they are radially symmetric, just like a swastika.

For the animation, I want you to do something similar to ordering, where iniitally, we generate the right number of red, green, blue, white s, and then we shuffle and assign the dots the colors, and then we move the dots positions to make them form the configuration that I described to you earlier. 

This is very similar to ordering, the difference is that instead of arranging into sorted by opacity, we are arranging to fit our configuration.

Ask me questions where you think it is unclear.

If the code grows larger than 300 lines, refactor each of the different animations logic (filtering/ordering/clustering) into separate isolated files.


Remember: keep the dependency arrays as minimal as possible, don't add things just to remove warning, because a recurring pattrn is that we get to an infinite loop of updates and the diagrams just don't work
