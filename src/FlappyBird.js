import React from 'react'




export default class FlappyBird extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      ctx: null
    }
   }
  componentDidMount() {
    this.setState({ctx: this.canvas.current.getContext("2d")})
    var FPS = 40;
    var jump_amount = -10;
    var max_fall_speed = +10;
    var acceleration = 1;
    var pipe_speed = -2;
    var game_mode = 'prestart';
    var time_game_last_running;
    var bottom_bar_offset = 0;
    var pipes = [];


    function MySprite(img_url) {
      this.x = 0;
      this.y = 0;
      this.visible = true;
      this.velocity_x = 0;
      this.velocity_y = 0;
      this.MyImg = new Image();
      this.MyImg.src = img_url || '';
      this.angle = 0;
      this.flipV = false;
      this.flipH = false;
    }
    MySprite.prototype.Do_Frame_Things = function (ctx) {
      ctx.save();
      ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
      ctx.rotate(this.angle * Math.PI / 180);
      if (this.flipV) ctx.scale(1, -1);
      if (this.flipH) ctx.scale(-1, 1);
      if (this.visible) ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
      this.x = this.x + this.velocity_x;
      this.y = this.y + this.velocity_y;
      ctx.restore();
    }
    const ImagesTouching =(thing1, thing2) => {
      if (!thing1.visible || !thing2.visible) return false;
      if (thing1.x >= thing2.x + thing2.MyImg.width || thing1.x + thing1.MyImg.width <= thing2.x) return false;
      if (thing1.y >= thing2.y + thing2.MyImg.height || thing1.y + thing1.MyImg.height <= thing2.y) return false;
      return true;
    }
    const Got_Player_Input = (MyEvent) => {
      // eslint-disable-next-line default-case
      switch (game_mode) {
        case 'prestart': {
          game_mode = 'running';
          break;
        }
        case 'running': {
          bird.velocity_y = jump_amount;
          break;
        }
        case 'over': if (new Date() - time_game_last_running > 1000) {
          reset_game();
          game_mode = 'running';
          break;
        }
      }
    //   MyEvent.preventDefault();
    }
    window.addEventListener("touchstart", Got_Player_Input);
    window.addEventListener("mousedown", Got_Player_Input);
    window.addEventListener("keydown", Got_Player_Input);
    window.addEventListener("clappityclap", Got_Player_Input);
    const make_bird_slow_and_fall = () => {
      if (bird.velocity_y < max_fall_speed) {
        bird.velocity_y = bird.velocity_y + acceleration;
      }
      if (bird.y > this.canvas.current.height - bird.MyImg.height) {
        bird.velocity_y = 0;
        game_mode = 'over';
      }
    }
    const add_pipe = (x_pos, top_of_gap, gap_width) => {
      var top_pipe = new MySprite();
      top_pipe.MyImg = pipe_piece;
      top_pipe.x = x_pos;
      top_pipe.y = top_of_gap - pipe_piece.height;
      top_pipe.velocity_x = pipe_speed;
      pipes.push(top_pipe);
      var bottom_pipe = new MySprite();
      bottom_pipe.MyImg = pipe_piece;
      bottom_pipe.flipV = true;
      bottom_pipe.x = x_pos;
      bottom_pipe.y = top_of_gap + gap_width;
      bottom_pipe.velocity_x = pipe_speed;
      pipes.push(bottom_pipe);
    }
    function make_bird_tilt_appropriately() {
      if (bird.velocity_y < 0) {
        bird.angle = -15;
      }
      else if (bird.angle < 70) {
        bird.angle = bird.angle + 4;
      }
    }
    const show_the_pipes = () => {
      for (var i = 0; i < pipes.length; i++) {
        pipes[i].Do_Frame_Things(this.state.ctx);
      }
    }
    const check_for_end_game = () => {
      for (var i = 0; i < pipes.length; i++)
        if (ImagesTouching(bird, pipes[i])) game_mode = "over";
    }
    const display_intro_instructions = () => {
      this.state.ctx.font = "25px Arial";
      this.state.ctx.fillStyle = "red";
      this.state.ctx.textAlign = "center";
      this.state.ctx.fillText("Press, touch or click to start", this.canvas.current.width / 2, this.canvas.current.height / 4);
    }
    const display_game_over = () => {
      var score = 0;
      for (var i = 0; i < pipes.length; i++)
        if (pipes[i].x < bird.x) score = score + 0.5;
      this.state.ctx.font = "30px Arial";
      this.state.ctx.fillStyle = "red";
      this.state.ctx.textAlign = "center";
      this.state.ctx.fillText("Game Over", this.canvas.current.width / 2, 100);
      this.state.ctx.fillText("Score: " + score, this.canvas.current.width / 2, 150);
      this.state.ctx.font = "20px Arial";
      this.state.ctx.fillText("Click, touch, or press to play again", this.canvas.current.width / 2, 300);
    }
    const display_bar_running_along_bottom = () => {
      if (bottom_bar_offset < -23) bottom_bar_offset = 0;
      this.state.ctx.drawImage(bottom_bar, bottom_bar_offset, this.canvas.current.height - bottom_bar.height);
    }
    const reset_game = () => {
      bird.y = this.canvas.current.height / 2;
      bird.angle = 0;
      pipes = [];                           // erase all the pipes from the array
      add_all_my_pipes();                 // and load them back in their starting positions
    }
    const add_all_my_pipes = () => {
      add_pipe(500, 100, 140);
      add_pipe(800, 50, 140);
      add_pipe(1000, 250, 140);
      add_pipe(1200, 150, 120);
      add_pipe(1600, 100, 120);
      add_pipe(1800, 150, 120);
      add_pipe(2000, 200, 120);
      add_pipe(2200, 250, 120);
      add_pipe(2400, 30, 100);
      add_pipe(2700, 300, 100);
      add_pipe(3000, 100, 80);
      add_pipe(3300, 250, 80);
      add_pipe(3600, 50, 60);
      var finish_line = new MySprite("http://s2js.com/img/etc/flappyend.png");
      finish_line.x = 3900;
      finish_line.velocity_x = pipe_speed;
      pipes.push(finish_line);
    }
    var pipe_piece = new Image();
    pipe_piece.onload = add_all_my_pipes;
    pipe_piece.src = "http://s2js.com/img/etc/flappypipe.png";
    const Do_a_Frame = () => {
      this.state.ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
      bird.Do_Frame_Things(this.state.ctx);
      display_bar_running_along_bottom();
      // eslint-disable-next-line default-case
      switch (game_mode) {
        case 'prestart': {
          display_intro_instructions();
          break;
        }
        case 'running': {
          time_game_last_running = new Date();
          bottom_bar_offset = bottom_bar_offset + pipe_speed;
          show_the_pipes();
          make_bird_tilt_appropriately();
          make_bird_slow_and_fall();
          check_for_end_game();
          break;
        }
        case 'over': {
          make_bird_slow_and_fall();
          display_game_over();
          break;
        }
      }
    }
    var bottom_bar = new Image();
    bottom_bar.src = "http://s2js.com/img/etc/flappybottom.png";

    var bird = new MySprite("http://s2js.com/img/etc/flappybird.png");
    bird.x = this.canvas.current.width / 3;
    bird.y = this.canvas.current.height / 2;

    setInterval(Do_a_Frame, 1000 / FPS);
  }
  render() {
    return (
      <canvas ref={this.canvas} width={320} height={480} style={{
        background: "url('http://s2js.com/img/etc/flappyback.png')", backgroundSize: '100%', height: '95%'
      }}></canvas >
    )
  }
}
