local config = json.decode(LoadResourceFile(GetCurrentResourceName(), "config.json"))
local bank_coords = config.bankBlips.coords


function display_help_text()
  BeginTextCommandDisplayHelp("STRING")
  AddTextComponentString("Open bank: ~INPUT_PICKUP~")
  EndTextCommandDisplayHelp(0, true, false, -1)
end

CreateThread(function ()
    
  if not config.target.enabled then
    while true do
      local player_id = PlayerPedId()
      local player_coords = GetEntityCoords(player_id)
      local sleep = 1000

      for i = 1, #bank_coords do
        local pos = bank_coords[i]

        local dist = #(player_coords - vector3(pos.x, pos.y, pos.z))
        if dist <= 10.0 then
          DrawMarker(2, pos.x, pos.y, pos.z, 0.0, 0.0, 0.0, 0.0, 180.0, 0.0, 0.5, 0.5, 0.3, 255, 255, 255, 50, false, true, 2, nil, nil, false)

          if dist <= 3.5 then
            display_help_text()

            if IsControlJustReleased(0, 38) then
              exports["pefcl"]:openBank()
            end
          else
            ClearHelp(true)
          end


          sleep = 0
        end
      end

      Wait(sleep)
    end
  end
end)
