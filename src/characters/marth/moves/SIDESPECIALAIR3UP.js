import marth from "./index";
import {player} from "../../../main/main";
import {turnOffHitboxes} from "../../../physics/actionStateShortcuts";
import {sounds} from "../../../main/sfx";
import {dancingBladeCombo} from "../dancingBladeCombo";
import {drawVfx} from "../../../main/vfx/drawVfx";
import {Vec2D} from "../../../main/util/Vec2D";
import {dancingBladeAirMobility} from "../dancingBladeAirMobility";
import WAIT from "../../shared/moves/WAIT";
import FALL from "../../shared/moves/FALL";
export default {
  name: "SIDESPECIALAIR3UP",
  canPassThrough: false,
  canEdgeCancel: false,
  canGrabLedge: [false, false],
  wallJumpAble: false,
  headBonk: false,
  canBeGrabbed: true,
  landType: 1,
  init: function (p, input) {
    player[p].actionState = "SIDESPECIALAIR3UP";
    player[p].timer = 0;
    player[p].phys.dancingBlade = false;
    player[p].phys.dancingBladeDisable = false;
    turnOffHitboxes(p);
    player[p].hitboxes.id[0] = player[p].charHitboxes.dbair3up.id0;
    player[p].hitboxes.id[1] = player[p].charHitboxes.dbair3up.id1;
    player[p].hitboxes.id[2] = player[p].charHitboxes.dbair3up.id2;
    player[p].hitboxes.id[3] = player[p].charHitboxes.dbair3up.id3;
    sounds.shout3.play();
    marth.SIDESPECIALAIR3UP.main(p, input);
  },
  main: function (p, input) {
    player[p].timer++;
    dancingBladeCombo(p, 18, 38, input);
    if (!marth.SIDESPECIALAIR3UP.interrupt(p, input)) {
      if (player[p].timer > 9 && player[p].timer < 18) {
        drawVfx("swing", new Vec2D(0, 0), player[p].phys.face, {
          pNum: p,
          swingType: "SIDESPECIALAIR3UP",
          frame: player[p].timer - 10
        });
      }
      dancingBladeAirMobility(p, input);
      player[p].phys.cVel.x = 0;
      if (player[p].timer === 13) {
        player[p].hitboxes.active = [true, true, true, true];
        player[p].hitboxes.frame = 0;
        sounds.dancingBlade.play();
      }
      if (player[p].timer > 13 && player[p].timer < 18) {
        player[p].hitboxes.frame++;
      }
      if (player[p].timer === 18) {
        turnOffHitboxes(p);
      }
    }
  },
  interrupt: function (p, input) {
    if (player[p].timer > 46) {
      if (player[p].phys.grounded) {
        WAIT.init(p, input);
      }
      else {
        FALL.init(p, input);
      }
      return true;
    }
    else if (player[p].phys.dancingBlade) {
      if (input[p][0].lsY > 0.56) {
        marth.SIDESPECIALAIR4UP.init(p, input);
      }
      else if (input[p][0].lsY < -0.56) {
        marth.SIDESPECIALAIR4DOWN.init(p, input);
      }
      else {
        marth.SIDESPECIALAIR4FORWARD.init(p, input);
      }
      return true;
    }
    else {
      return false;
    }
  },
  land: function (p, input) {
    player[p].actionState = "SIDESPECIALGROUND3UP";
  }
};
